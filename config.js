module.exports = {
    IP: process.env.IP,
    PORT: process.env.PORT,
    // MONGODB_URI: "mongodb://mariuszdw:lls1995@ds061196.mlab.com:61196/yelp_camp"
    // MONGODB_URI: "mongodb://localhost:27017/yelp_camp"
    MONGODB_URI: process.env.MONGODB_URI
}