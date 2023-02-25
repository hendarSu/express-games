const { User, Room } = require("./../models");

module.exports = {
    index : async (req, res, next) => {

        // Count Data User
        const countUser = await User.count();
        const countRoom = await Room.count();

        res.render(
            "admin", 
            { 
                page: { title: "Halaman admin!"}, 
                user: req.user,
                content : [
                    { title : "USER", count: countUser, grid : 6  },
                    { title : "ROOM", count: countRoom, grid: 6  }
                  ]
            });
    }
}