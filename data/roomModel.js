const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({

  participants: Array,

}, {collection: 'rooms'});

roomSchema.statics = {

  getAllRooms: async () => mongoose.model('roomModel', roomSchema).find(),

  getRoom: async (participantOne, participantTwo) => {

    const getRoomOne = await Room.getAllRooms()
      .then(async result => {

        const oneRoom = await result.filter(room => {

          if (room.participants.includes(participantOne) && room.participants.includes(participantTwo)) {

            return room._id;

          }

        });

        return oneRoom[0]._id;

      })
      .catch(err => console.log(err));

    console.log('### getRoomOne = ', getRoomOne);

    return getRoomOne;

  }

};

const Room = mongoose.model('roomModel', roomSchema);

module.exports =  Room;
