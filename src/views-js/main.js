module.exports = [
  {
    position:"lower",
    link: "/test0/",
    label: "Test0",
    logginRequire: false,
    get: links => function (req, res) {

      }
  },
  {
    position:"lower",
    link: "/test1/",
    label: "Test1",
    logginRequire: true,
    get: links => function (req, res) {

      }
  },
  {
    position:"lower",
    link: "/test2/",
    label: "Test2",
    get: links => function (req, res) {

      }
  },
]
