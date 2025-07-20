const mongoose = require("mongoose");
const validator = require("validator");
const JWT=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isEmail(value))
        throw new Error("Enter correct Email")
      },
    },
    password: {
      type: String,
      required:true,
      validate(value) {
        if (!validator.isStrongPassword(value))
        throw new Error("Enter strong Password");
      },
    },
    role: {
      type: String,
      enum: ["isAdmin", "doctor", "patient"],
      default: "patient",
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
    },
    aboutdoctor:{
      type:String,
      maxLength:200

    },
    qualification:{
      type:String,
    },
    image:{
      type:String
    },
    ispayment:{
      type:Boolean,
      default:false
    },
    availableDays:{
      type:[String],
      default:['Monday','TuesDay','Wednesday','Thursday','Friday']
    },
    availableTimeSlots:{
      type:[String],
      default :['09:00 AM','10:00 AM','11:00 AM','12:00 AM','1:00 PM','2:00 PM','03:00 PM','04:00 PM','05:00 PM',]
    }
  },
  {
    timestamps: true,
  }
);
// Compound index for email (used in login)
userSchema.index({ email: 1 });

// If you often search doctors by specialization, add this:
userSchema.index({ specialization: 1 }, { sparse: true });

// For full name searches
userSchema.index({ firstName: 1, lastName: 1 });

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await JWT.sign(
    { _id: user._id, role: this.role },
    process.env.SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );
  return token;
};
userSchema.methods.validatepassword = async function (password) {
  const user = this;
  const passwordHash = user.password;
  const ispassword = await bcrypt.compare(password, passwordHash);
  return ispassword;
};
// userSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   next();
// });

module.exports = mongoose.model("User", userSchema);
