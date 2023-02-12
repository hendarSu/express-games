const express = require("express");
const base_response = require("../libs/base-response");
const checkToken = require("../middlewares/checkToken");

const { Room, RoomSession, sequelize } = require("../models");
const Sequelize = require("sequelize");

const randomstring = require("randomstring");
const { waiting, running, completed, draw } = require("../libs/room-status");

const api = express.Router();

api.post("/v1/create-room", checkToken, async (req, res, next) => {
    const roomInisiate = {
        kode: randomstring.generate({
            length: 5,
            charset: 'alphabetic'
        }).toUpperCase(),
        home: req.user.id,
        status: waiting
    }
    try {
        const rooms = await Room.create(roomInisiate)
        res.status(201).json(base_response(rooms, "success", "Create Room Berhasil!"))
    } catch (error) {
        res.status(400).json(base_response(null, "failed", error));
    }
});

api.post("/v1/room/join", checkToken, async (req, res, next) => {
    try {
        const { kode } = req.body;
        const room = await Room.findOne(
            {
                where: { kode }
            }
        );

        if (!room) throw new Error("Anda tidak bisa bergabung di room ini!");

        if (room.home === req.user.id) throw new Error("Maaf Anda sudah join sebagai pemilik room " + kode)
        if (room.away === req.user.id) throw new Error("Maaf Anda sudah join diroom ini : " + kode)

        await Room.update({
            status: running,
            away: req.user.id
        }, {
            where: {
                kode
            }
        });

        res.status(201).json(base_response(null, "success", "Anda berhasil join di room " + kode))
    } catch (error) {
        res.status(200).json(base_response(null, "failed", error.message));
    }
});

api.post("/v1/fight/:id", checkToken, async (req, res, next) => {
    const sessionCount = 3;

    let { choice } = req.body;

    let isHome = false;

    try {
        // inisiasion db transaction
        const transaction = await sequelize.transaction();

        try {

            const room = await Room.findOne({
                where: {
                    id: req.params.id,
                    status: {
                        [Sequelize.Op.notIn]: [completed, draw]
                    }
                }
            })

            if (!room) throw new Error("Maaf room sudah selesai!");

            if (room.home === req.user.id) {
                isHome = true
            }

            const roomSession = await RoomSession.findAll({
                where: {
                    room_id: req.params.id
                }
            });

            // Condition when session create
            if (roomSession.length > 0) {
                const roomSessionSingle = await RoomSession.findOne({
                    where: { room_id: room.id, status: waiting },
                    order: [
                        ['createdAt', 'ASC']
                    ]
                });

                if (isHome && roomSessionSingle.home_choice) throw new Error("Maaf Player 1 anda sudah menginputkan pilihan di sesi ini!");

                if (!isHome && roomSessionSingle.away_choice) throw new Error("Maaf Player 2 anda sudah menginputkan pilihan di sesi ini!");

                let win = null;
                let isDraw = false;
                let homeWin = false;
                let isFinish = false;

                // Section to update session room
                if (roomSessionSingle.home_choice === null && roomSessionSingle.away_choice === null) {
                    if (isHome) {
                        await RoomSession.update({
                            home_choice: choice,
                            win
                        }, { where: { id: roomSessionSingle.id } }, { transaction })
                    } else {
                        await RoomSession.update({
                            away_choice: choice,
                            win
                        }, { where: { id: roomSessionSingle.id } }, { transaction })
                    }
                } else {

                    // Condition win
                    if (roomSessionSingle.home_choice === "P" && choice === "R") {
                        win = room.home;
                        homeWin = true;
                    } else if (roomSessionSingle.home_choice === "S" && choice === "R") {
                        win = room.away;
                    } else if (roomSessionSingle.home_choice === "R" && choice === "R") {
                        isDraw = true;
                    } else if (roomSessionSingle.home_choice === "P" && choice === "S") {
                        win = room.away;
                    } else if (roomSessionSingle.home_choice === "S" && choice === "S") {
                        isDraw = true;
                    } else if (roomSessionSingle.home_choice === "R" && choice === "S") {
                        win = room.home;
                        homeWin = true;
                    } else if (roomSessionSingle.home_choice === "P" && choice === "P") {
                        isDraw = true;
                    } else if (roomSessionSingle.home_choice === "S" && choice === "P") {
                        win = room.home;
                        homeWin = true;
                    } else if (roomSessionSingle.home_choice === "R" && choice === "P") {
                        win = room.away;
                    }
                    // away
                    else if (roomSessionSingle.away_choice === "P" && choice === "R") {
                        win = room.away;
                    } else if (roomSessionSingle.away_choice === "S" && choice === "R") {
                        win = room.home;
                        homeWin = true;
                    } else if (roomSessionSingle.away_choice === "R" && choice === "R") {
                        isDraw = true;
                    } else if (roomSessionSingle.away_choice === "P" && choice === "S") {
                        win = room.home;
                        homeWin = true;
                    } else if (roomSessionSingle.away_choice === "S" && choice === "S") {
                        isDraw = true;
                    } else if (roomSessionSingle.away_choice === "R" && choice === "S") {
                        win = room.away;
                    } else if (roomSessionSingle.away_choice === "P" && choice === "P") {
                        isDraw = true;
                    } else if (roomSessionSingle.away_choice === "S" && choice === "P") {
                        win = room.away;
                    } else if (roomSessionSingle.away_choice === "R" && choice === "P") {
                        win = room.home;
                        homeWin = true;
                    } else {
                        isDraw = false;
                    }
 
                    if (isHome) {
                        await RoomSession.update({
                            home_choice: choice,
                            status: isDraw ? draw : completed,
                            win
                        }, { where: { id: roomSessionSingle.id } }, { transaction })
                    } else {
                        await RoomSession.update({
                            away_choice: choice,
                            status: isDraw ? draw : completed,
                            win
                        }, { where: { id: roomSessionSingle.id } }, { transaction })
                    }

                    isFinish = true;
                }

                // Menentukan Result terakhir
                if (roomSessionSingle.kode_session === 3 && isFinish) {
                    const roomSessionFinish = await RoomSession.findAll({
                        where: {
                            room_id: req.params.id
                        }
                    });

                    let home = 0;
                    let away = 0;
                    let isDrawRoom = false;
                    let winRoom = null;
                    let homeWinRoom = false;

                    for (const iterator of roomSessionFinish) {
                        console.log(iterator);
                        if (iterator.status !== "DRAW") {
                            if (iterator.win === room.home) {
                                home = home + 1;
                            } else {
                                away = away + 1;
                            }
                        }
                    }

                    console.log(`${home} > ${away}`);
                    if (home > away) {
                        winRoom = room.home;
                        homeWinRoom = true
                    } else if (home < away) {
                        winRoom = room.away;
                    } else {
                        isDrawRoom = true;
                    }

                    await Room.update({
                        win: winRoom,
                        status: isDrawRoom ? draw : completed
                    }, { where: { id: room.id } }, { transaction });

                    await transaction.commit();

                    if (isDrawRoom) {
                        res.status(200).json(base_response(null, "success", `Room ${room.kode} : Draw!`))
                    } else {
                        if (homeWinRoom) {
                            res.status(200).json(base_response(null, "success", `Room ${room.kode} : selamat player 1 win!`))
                        } else {
                            res.status(200).json(base_response(null, "success", `Room ${room.kode} : selamat player 2 win!`))
                        }
                    }
                } else {
                    await transaction.commit();

                    if (isDraw) {
                        res.status(200).json(base_response(null, "success", `Session ${roomSessionSingle.kode_session} : Draw!`))
                    } else {
                        if (isFinish) {
                            if (homeWin) {
                                res.status(200).json(base_response(null, "success", `Session ${roomSessionSingle.kode_session} : selamat player 1 win!`))
                            } else {
                                res.status(200).json(base_response(null, "success", `Session ${roomSessionSingle.kode_session} : selamat player 2 win!`))
                            }   
                        } else {
                            if (isHome) {
                                res.status(200).json(base_response(null, "success", `Session ${roomSessionSingle.kode_session} : Menunggu Player 2 memilih!`))
                            } else {
                                res.status(200).json(base_response(null, "success", `Session ${roomSessionSingle.kode_session} : Menunggu Player 1 memilih!`))
                            }
                        }
                    }
                }
            } else {
                // Genreate Session
                for (let i = 0; i < sessionCount; i++) {
                    const session = await RoomSession.create({
                        kode_session: i + 1,
                        status: waiting,
                        room_id: room.id
                    }, { transaction })

                    let last = i + 1;

                    if (last === sessionCount) {
                        await transaction.commit();

                        // Generate pilihan pertama
                        if (isHome) {
                            await RoomSession.update({
                                home_choice: choice
                            }, {
                                where: { kode_session: 1, room_id: room.id }
                            })

                            res.status(200).json(base_response(null, "success", `Session 1 : Menunggu Player 2 memilih!`))
                        } else {
                            await RoomSession.update({
                                away_choice: choice
                            }, {
                                where: { kode_session: 1, room_id: room.id }
                            })

                            res.status(200).json(base_response(null, "success", `Session 1 : Menunggu Player 1 memilih!`));
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error);
            await transaction.rollback();
            res.status(400).json(base_response(null, "failed", error.message));
        }
    } catch (error) {
        res.status(400).json(base_response(null, "failed", error.message));
    }
});
module.exports = api;