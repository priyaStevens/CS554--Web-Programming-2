const constructorMethod = (app) => {
    app.get("/", (req, response) => {
        response.render("home", {
            pageTitle: "Priya Gupta's Top 10 Favorite Movies"
        });
    });
    app.use("*", (req, response) => {
        response.status(400).render("error", {
            pageTitle: "404: Not Found"
        });
    });
}

module.exports = constructorMethod;