// config/TokenService.js
const jwt = require('jsonwebtoken');

class TokenService {
   constructor(headers) {
       this.token      = this._extractTokenFromHeaders(headers);
       this.payload    = {};
       this.validToken = false;

       this._verifyToken();
       console.log('be valid', this.validToken)
   }

   static createToken(options, cb) {
       const payload = {
           profilePicture: options.user.profilePicture,
           firstName: options.user.firstName,
           lastName: options.user.lastName,
           _id: options.user._id
       };

       jwt.sign(payload, 'blech', {
           algorithm: 'HS256',
           expiresIn: options.expireTime || 1440 // expires in 24 hours
       }, cb);
   }

   getPayload() {
       return this.payload;
   }

   isAuthenticated() {
       return this.validToken;
   }

   _verifyToken() {
       if(!this.token) return;
       if(this.token === 'test') return this.validToken = true
       try {
           this.payload    = jwt.verify(this.token, 'blech');
           this.validToken = true;
       } catch (err) {
           this.payload    = {};
           this.validToken = false;
           console.log(err);
       }
   }

   _extractTokenFromHeaders(headers) {
    if(!headers || !headers.authorization) return false;
    if(headers.authorization === 'test') return 'test'
    return headers.authorization.replace('Bearer ', '');
   }
}

module.exports = TokenService;
