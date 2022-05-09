const express = require("express")
const { PrismaClient } = require("@prisma/client")
const router = express.Router()

const prisma = new PrismaClient()
prisma
  .user
  .deleteMany({})
  .then(() => prisma.user.create({ data: { username: 'test', password: 'test' } }))
  .catch()

router.get("/", (req, res) => {
  res.send(`
    <ul>
      <li title="SQL Injection"><a href="/users/login">Login</a></li>
      <li title="Cross-Site Scripting (XSS)"><a href="/users/calculator">Calculator</a></li>
    </ul>
  `)
})

router.route("/login")
.get((req, res) => {
  res.render("users/user")
})

router
  .route("/calculator")
  .get((_, res) => res.render("users/calculator"))

router.route("/login").post((req, res) => {
  prisma
    .$queryRaw`select * from user where username = ${req.body.username} and password = ${req.body.password}`
    // .$queryRawUnsafe(`select * from user where username = '${req.body.username}' and password = '${req.body.password}'`)
    .then(result => {
      if(result.length > 0) return res.render("users/success");
      res.render("users/failure")
    })
    .catch(err => {
      console.log(err)
      res.render("users/failure")
    })
})

router.post("/", (req, res) => {
  const isValid = false
  if (isValid) {
    users.push({ firstName: req.body.firstName })
    res.redirect(`/users/${users.length - 1}`)
  } else {
    console.log("Error")
    res.render("users/new", { firstName: req.body.firstName })
  }
})

router
  .route("/:id")
  .get((req, res) => {
    console.log(req.user)
    res.send(`Get User With ID ${req.params.id}`)
  })
  .put((req, res) => {
    res.send(`Update User With ID ${req.params.id}`)
  })
  .delete((req, res) => {
    res.send(`Delete User With ID ${req.params.id}`)
  })

const users = [{ name: "Kyle" }, { name: "Sally" }]
router.param("id", (req, res, next, id) => {
  req.user = users[id]
  next()
})

function logger(req, res, next) {
  console.log(req.originalUrl)
  next()
}

module.exports = router
