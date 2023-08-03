const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    agoraKey: { type: String, default: "AGORA KEY" },
    agoraCertificate: { type: String, default: "AGORA CERTIFICATE" },

    privacyPolicyLink: { type: String, default: "PRIVACY POLICY LINK" },
    privacyPolicyText: { type: String, default: "PRIVACY POLICY TEXT" },
    termAndCondition: { type: String, default: "Term And Condition" },

    googlePlaySwitch: { type: Boolean, default: false },
    googlePlayEmail: { type: String, default: "GOOGLE PLAY EMAIL" },
    googlePlayKey: { type: String, default: "GOOGLE PLAY KEY" },

    stripeSwitch: { type: Boolean, default: false },
    stripePublishableKey: { type: String, default: "STRIPE PUBLISHABLE KEY" },
    stripeSecretKey: { type: String, default: "STRIPE SECRET KEY" },

    razorPaySwitch: { type: Boolean, default: false },
    razorPayId: { type: String, default: "RAZOR PAY ID" },
    razorSecretKey: { type: String, default: "RAZOR SECRET KEY" },

    isAppActive: { type: Boolean, default: true },

    welcomeMessage: { type: String, default: "Welcome to hookzy" }, // minimum diamond for withdraw [redeem]
    redirectAppUrl: { type: String, default: "Here Redirect App URL" },
    redirectMessage: { type: String, default: "Here Redirect Message" },

    chargeForRandomCall: { type: Number, default: 0 },
    chargeForPrivateCall: { type: Number, default: 0 },
    withdrawLimit: { type: Number, default: 0 },

    coinPerDollar: { type: Number, default: 50 },
    coinCharge: { type: Number, default: 0 },

    paymentGateway: { type: Array, default: [] },

    // isData: { type: Boolean, default: true },
    // location: { type: Array, default: [] },
    // numberOfFreeVideoCall: { type: Number, default: 5 },
    // minimumLiveTimeForHost: { type: Number, default: 0 },
    // durationOfFreeCall: { type: Number, default: 30 },
    // currency: { type: String, default: "$" },
    // chargeForMatchMale: { type: Number, default: 10 },
    // chargeForMatchFemale: { type: Number, default: 10 },
    // loginBonus: { type: Number, default: 30 },
    // maxLoginBonus: { type: Number, default: 30 },
    // minPrivateCallCharge: { type: Number, default: 30 },
    // referralBonus: { type: Number, default: 30 },
    // paymentGateway: { type: Array, default: [] },
    // hostSalary: { type: Number, default: 0 },
    // hostWithdrawalLimit: { type: Number, default: 0 },
    // webPaymentLink: { type: String, default: "WEB PAYMENT LINK" },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

module.exports = mongoose.model("Setting", settingSchema);
