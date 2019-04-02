const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

// router.get('/create', (req, res) => {
//   if (!req.user) {
//     req.session.redirectTo = '/room/create';
//   	res.redirect('/auth/login');
//   	return;
//   }
//
//   console.log('ayyy');
// });

router.get('/create', (req, res) => {
  if (!req.user) {
    req.session.redirectTo = '/room/create';
    res.redirect('/auth/login');
    return;
  }

  const { id } = req.body;
  console.log(req.user);

  if (!id) {
    console.log('invalid id');
    res.redirect('/')
    return;
  }
  
  Room.create(id, owner, (err, room) => {

  })
})

router.get('/*', (req, res) => {
  var id = req.params[0]
  const { userId } = req.cookies;
  console.log(userId);
  Room.find(id, (err, room)=> {
    if (err) {console.log(err);}
    if (!room) {
      res.render('noroom')
      return;
    }
    // createRoom(id, 'test')
    res.render('pages/room', {room: room});
  })
});

module.exports = router;
