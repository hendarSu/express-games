const base_response = require("../libs/base-response");
const dashboardRepository = require("../repositories/dashboard.repository");

/**
 * Function get data Dashboard
 * @returns data
 */
const getDataDashboard = async (req) => {
    const countUser = await dashboardRepository.getCountUser();
    const countRoom = await dashboardRepository.getCountRoom(null);
    const countRoomCompleted = await dashboardRepository.getCountRoom(
        {
            status: "COMPLETED"
        });

    // buat section untuk query data Room dan join dengan data USER Winner
    const rooms = await dashboardRepository.getListRoom();

    const data = {
        page: { title: "Halaman admin!" },
        user: (req.user) ? req.user : null,
        content: [
            { title: "USER", count: countUser, grid: 6 },
            { title: "ROOM Finish", count: countRoomCompleted, grid: 6 },
            { title: "ROOM", count: countRoom, grid: 12 }
        ],
        rooms: rooms
    }
    return data
}


// Function export Global
module.exports = {
    /**
     * function to accsess page Dashboard Monolith
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    index: async (req, res, next) => {
        // Count Data User
        const data = await getDataDashboard(req);
        res.render("admin", data);
    },

    /**
     * Function RESTFull Api for get data Dashboard
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getDashboard: async (req, res, next) => {
        const data = await getDataDashboard(req);
        res.status(200).json(base_response(data, "sucess", "Data Dashboard"))
    }
}