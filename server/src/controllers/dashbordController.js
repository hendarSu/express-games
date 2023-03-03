const { User, Room } = require("../models");

module.exports = {
    index : async (req, res, next) => {
        // Count Data User
        const countUser = await User.count();
        const countRoom = await Room.count();
        const countRoomCompleted = await Room.count(
            {
                where : {
                    status: "COMPLETED"
                }
            }
        );

        // buat section untuk query data Room dan join dengan data USER Winner
        const rooms = await Room.findAll({
            include : [ 
                "user"
            ]
        });

        res.render(
            "admin", 
            { 
                page: { title: "Halaman admin!"}, 
                user: req.user,
                content : [
                    { title : "USER", count: countUser, grid : 6  },
                    { title : "ROOM Finish", count: countRoomCompleted, grid: 6  },
                    { title : "ROOM", count: countRoom, grid: 12  }
                  ],
                rooms: rooms
            });
    }
}