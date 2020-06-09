const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({

  participants: Array,

}, {collection: 'rooms'});

roomSchema.statics = {

  getAllRooms: async () => mongoose.model('roomModel', roomSchema).find()
                                                                          .lean(),

  getRoom: (participantOne, participantTwo) => {

    Room.getAllRooms()
      .then(result => {

        console.log('RoomModel (getRooms)', participantOne, participantTwo);

        return result.filter(room => {

          if (room.participants.includes(participantOne) && room.participants.includes(participantTwo)) {

            console.log('room id ====', room._id);

            return room._id;

          }

        });

      })
      .catch(err => console.log(err));

  }

};

const Room = mongoose.model('roomModel', roomSchema);

module.exports =  Room;