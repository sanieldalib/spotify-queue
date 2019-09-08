

const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const { rooms } = require('../Rooms');

// router.get('/create', (req, res) => {
//   if (!req.user) {
//     req.session.redirectTo = '/room/create';
//   	res.redirect('/auth/login');
//   	return;
//   }
//
//   console.log('ayyy');
// });

router.get('/create/*', (req, res) => {
  const id = req.params[0]
  if (!req.user) {
    req.session.redirectTo = `/room/create/${id}`;
    res.redirect('/auth/login');
    return;
  }

  const owner = req.user.tokens.accessToken

  // if (!id) {
  //   console.log('invalid id');
  //   res.redirect('/')
  //   return;
  // }

  Room.createRoom(id, owner, (err, room) => {
    if (err) {
      console.log(err);
      res.redirect('/room/create')
      return;
    }
    res.redirect(`/room/${id}`);
  });

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

    res.render('pages/room', {room: room});
  })
});

module.exports = router;
