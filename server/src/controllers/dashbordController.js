const dashboardRepository = require("../repositories/dashboard.repository");

module.exports = {
    index: async (req, res, next) => {
        // Count Data User
        const countUser = await dashboardRepository.getCountUser();
        const countRoom = await dashboardRepository.getCountRoom(null);
        const countRoomCompleted = await dashboardRepository.getCountRoom(
            {
                status: "COMPLETED"
            });

        // buat section untuk query data Room dan join dengan data USER Winner
        const rooms = await dashboardRepository.getListRoom();

        res.render(
            "admin",
            {
                page: { title: "Halaman admin!" },
                user: req.user,
                content: [
                    { title: "USER", count: countUser, grid: 6 },
                    { title: "ROOM Finish", count: countRoomCompleted, grid: 6 },
                    { title: "ROOM", count: countRoom, grid: 12 }
                ],
                rooms: rooms
            });
    },
    getDashboard: async (req, res, next) => {

    }
}