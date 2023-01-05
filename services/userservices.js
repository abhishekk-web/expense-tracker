const getData = (req, where) => {
    return req.user.getData(where);
}

module.exports = {
    getData
}