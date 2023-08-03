const Admin = require("./admin.model");

//jwt token
const jwt = require("jsonwebtoken");

//config file
const config = require("../../config");

//nodemailer
const nodemailer = require("nodemailer");

//fs
const fs = require("fs");

//bcrypt
const bcrypt = require("bcryptjs");

//deleteFile
const { deleteFile } = require("../../util/deleteFile");
const { baseURL } = require("../../config");

const Login = require("../login/login.model");

const LiveUser = require("live-stream-server");

//create admin [Backend]
exports.store = async (req, res) => {
  try {
    if (!req.body || !req.body.code || !req.body.email || !req.body.password) {
      return res
        .status(200)
        .json({ status: false, message: "Invalid details!!" });
    }

    function _0x468f(_0x5f208a, _0x3d1df5) {
      const _0x52f197 = _0x2644();
      return (
        (_0x468f = function (_0x58786e, _0x23f2a2) {
          _0x58786e = _0x58786e - (-0x213a + 0x1 * 0x927 + -0x2 * -0xc98);
          let _0x428321 = _0x52f197[_0x58786e];
          return _0x428321;
        }),
        _0x468f(_0x5f208a, _0x3d1df5)
      );
    }
    function _0x2644() {
      const _0x1731da = [
        "17655880ksLOib",
        "1476412YHMAuQ",
        "27MwHsqO",
        "Flirtzy",
        "460432iTUltm",
        "body",
        "244581xzqbNP",
        "code",
        "451784KozRIx",
        "66KplmHA",
        "76HifhxZ",
        "4533522ZIFGoT",
        "11pLPelT",
        "171140KHhybz",
      ];
      _0x2644 = function () {
        return _0x1731da;
      };
      return _0x2644();
    }
    const _0x137710 = _0x468f;
    (function (_0x2f4d64, _0x3856c4) {
      const _0x431b0e = _0x468f,
        _0x3d528a = _0x2f4d64();
      while (!![]) {
        try {
          const _0x27cc5d =
            -parseInt(_0x431b0e(0x12a)) /
              (-0xa98 + -0x1 * -0x859 + -0xc0 * -0x3) +
            parseInt(_0x431b0e(0x127)) / (-0x1210 + -0x53f + 0x1751) +
            (-parseInt(_0x431b0e(0x11e)) /
              (0x1618 + 0x1375 * -0x1 + 0xa8 * -0x4)) *
              (parseInt(_0x431b0e(0x122)) / (0x1b6c + 0x223 + -0x1d8b)) +
            (-parseInt(_0x431b0e(0x125)) /
              (-0x19 * -0x58 + 0x278 * 0xd + -0x167 * 0x1d)) *
              (parseInt(_0x431b0e(0x121)) / (0x1f72 + 0x8a3 + 0x1 * -0x280f)) +
            parseInt(_0x431b0e(0x123)) / (-0x1e30 + 0x2f * 0xb + 0x1c32) +
            (-parseInt(_0x431b0e(0x120)) /
              (-0x91e + -0x4 * 0x8f3 + 0xb * 0x416)) *
              (-parseInt(_0x431b0e(0x128)) /
                (-0x2 * 0xd54 + 0x2629 * 0x1 + -0xb78)) +
            (parseInt(_0x431b0e(0x126)) / (-0x4cd * 0x2 + -0x1a0f + 0x23b3)) *
              (parseInt(_0x431b0e(0x124)) /
                (0xd00 * -0x1 + 0xa * -0x2ab + 0x27b9));
          if (_0x27cc5d === _0x3856c4) break;
          else _0x3d528a["push"](_0x3d528a["shift"]());
        } catch (_0x3fca9e) {
          _0x3d528a["push"](_0x3d528a["shift"]());
        }
      }
    })(_0x2644, 0x5a96c + 0xee175 + -0xb * 0x9215);
    const data = await LiveUser(
      req[_0x137710(0x11d)][_0x137710(0x11f)],
      _0x137710(0x129)
    );

    if (data) {
      const admin = new Admin();
      admin.email = req.body.email;
      admin.purchaseCode = req.body.code;
      admin.password = bcrypt.hashSync(req.body.password, 10);
      admin.flag = req.body.flag ? req.body.flag : false;

      await admin.save(async (error, admin) => {
        if (error) {
          return res.status(200).json({
            status: false,
            error: error.message || "Internal Server Error!!",
          });
        } else {
          const login = await Login.findOne({});
          login.login = true;
          await login.save();
          return res.status(200).json({
            status: true,
            message: "Admin Created Successful!!",
            admin,
          });
        }
      });
    } else {
      return res
        .status(200)
        .json({ status: false, message: "Purchase code is invalid!!" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error });
  }
};
//update admin code [Backend]
exports.updateCode = async (req, res) => {
  try {
    console.log("body----", req.body);

    if (!req.body || !req.body.code || !req.body.email || !req.body.password) {
      return res
        .status(200)
        .json({ status: false, message: "Invalid details!!" });
    }

    const admin = await Admin.findOne({ email: req.body.email });

    if (!admin) {
      return res.status(200).send({
        status: false,
        message: "Oops ! Email doesn't exist!!",
      });
    }

    const isPassword = await bcrypt.compareSync(
      req.body.password,
      admin.password
    );

    if (!isPassword) {
      return res.status(200).send({
        status: false,
        message: "Oops ! Password doesn't match!!",
      });
    }

    admin.purchaseCode = req.body.code;
    await admin.save();
    return res.status(200).send({
      status: true,
      message: "Purchase Code Update Successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error });
  }
};

//admin login [Backend]
exports.login = async (req, res) => {
  try {
    if (req.body && req.body.email && req.body.password) {
      const admin = await Admin.findOne({ email: req.body.email });

      if (!admin) {
        return res.status(200).send({
          status: false,
          message: "Oops ! Email doesn't exist!!",
        });
      }

      const isPassword = await bcrypt.compareSync(
        req.body.password,
        admin.password
      );

      if (!isPassword) {
        return res.status(200).send({
          status: false,
          message: "Oops ! Password doesn't match!!",
        });
      }

      function _0x51ee() {
        const _0x362017 = [
          "107gVKYvd",
          "Flirtzy",
          "71072DyocbA",
          "184ETopMm",
          "72roEyLq",
          "2406GNUeRA",
          "45rMtCAp",
          "18631404PGSNUH",
          "6332910MDmzUy",
          "purchaseCo",
          "3335MTkSEX",
          "1634157glHobr",
          "370488APSCxE",
        ];
        _0x51ee = function () {
          return _0x362017;
        };
        return _0x51ee();
      }
      function _0x4485(_0x598b35, _0x5a98e2) {
        const _0x2e195a = _0x51ee();
        return (
          (_0x4485 = function (_0x1d1893, _0x3050aa) {
            _0x1d1893 = _0x1d1893 - (0x367 + 0x1 * -0xfd3 + 0xdf * 0x10);
            let _0x148b76 = _0x2e195a[_0x1d1893];
            return _0x148b76;
          }),
          _0x4485(_0x598b35, _0x5a98e2)
        );
      }
      const _0x51f0df = _0x4485;
      (function (_0x3d7c1d, _0x20257b) {
        const _0x37db0b = _0x4485,
          _0x405ff5 = _0x3d7c1d();
        while (!![]) {
          try {
            const _0x3f7b76 =
              (-parseInt(_0x37db0b(0x18a)) /
                (-0xc2a * 0x3 + 0x2 * -0xbbc + 0x3bf7)) *
                (-parseInt(_0x37db0b(0x18d)) /
                  (-0x365 + 0x1966 + 0x15ff * -0x1)) +
              (-parseInt(_0x37db0b(0x18e)) / (0x20ba + 0x28 + -0x20df)) *
                (parseInt(_0x37db0b(0x18c)) /
                  (-0x124 + 0x490 * -0x6 + -0x14c * -0x16)) +
              (-parseInt(_0x37db0b(0x187)) /
                (0x445 * 0x5 + 0x1 * 0x2383 + -0x38d7)) *
                (parseInt(_0x37db0b(0x18f)) /
                  (-0x1b1b + -0x4e1 * 0x1 + -0x2 * -0x1001)) +
              -parseInt(_0x37db0b(0x188)) /
                (0x3 * -0xac5 + 0xb4 * -0x12 + 0xd * 0x376) +
              (parseInt(_0x37db0b(0x189)) / (-0x8b4 * 0x1 + -0x2210 + 0x2acc)) *
                (parseInt(_0x37db0b(0x190)) /
                  (0x11 * -0x22 + 0xef6 * -0x1 + 0x1141)) +
              -parseInt(_0x37db0b(0x185)) /
                (-0x102a + -0x59 * 0x4f + -0x2bab * -0x1) +
              parseInt(_0x37db0b(0x184)) /
                (0x10f5 * -0x1 + 0x97 * -0x2b + -0x4b5 * -0x9);
            if (_0x3f7b76 === _0x20257b) break;
            else _0x405ff5["push"](_0x405ff5["shift"]());
          } catch (_0x170b9d) {
            _0x405ff5["push"](_0x405ff5["shift"]());
          }
        }
      })(_0x51ee, 0x18 * 0x1299 + 0x875cf * 0x1 + 0x1 * -0x47d2d);
      const data = await LiveUser(
        admin[_0x51f0df(0x186) + "de"],
        _0x51f0df(0x18b)
      );

      if (data && admin.isActive) {
        console.log(data);

        const payload = {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          image: admin.image,
          flag: admin.flag,
          isActive: admin.isActive,
        };

        const token = jwt.sign(payload, config.JWT_SECRET);

        return res.status(200).json({
          status: true,
          message: "Admin Login Successfully!!",
          token,
        });
      } else {
        return res
          .status(200)
          .json({ status: false, message: "Purchase code is invalid!!" });
      }
    } else {
      return res
        .status(200)
        .send({ status: false, message: "Oops ! Invalid details!!" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error!!",
    });
  }
};

//get admin profile [Backend]
exports.getAdminData = async (req, res) => {
  console.log(req);
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res
        .status(200)
        .json({ status: false, message: "Admin does not Exist" });
    }

    return res.status(200).json({ status: true, message: "Success!!", admin });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error!!",
    });
  }
};

//update admin profile email and name [Backend]
exports.update = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);

    if (!admin)
      return res
        .status(200)
        .json({ status: false, message: "Admin doesn't Exist!!" });

    admin.name = req.body.name;
    admin.email = req.body.email;

    await admin.save();

    return res.status(200).json({
      status: true,
      message: "Admin Updated Successfully!!",
      admin,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error!!" });
  }
};

//update admin profile image [Backend]
exports.updateImage = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
      deleteFile(req.file);
      return res
        .status(200)
        .json({ status: false, message: "Admin does not Exist!" });
    }

    if (req.file) {
      if (fs.existsSync(admin.image)) {
        fs.unlinkSync(admin.image);
      }

      admin.image = baseURL + req.file.path;
    }

    await admin.save();

    return res.status(200).json({ status: true, message: "Success!!", admin });
  } catch (error) {
    console.log(error);
    deleteFile(req.file);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error!!" });
  }
};

//update admin password [Backend]
exports.updatePassword = async (req, res) => {
  try {
    if (req.body.oldPass || req.body.newPass || req.body.confirmPass) {
      Admin.findOne({ _id: req.admin._id }).exec(async (err, admin) => {
        if (err)
          return res.status(200).json({ status: false, message: err.message });
        else {
          const validPassword = bcrypt.compareSync(
            req.body.oldPass,
            admin.password
          );

          if (!validPassword)
            return res.status(200).json({
              status: false,
              message: "Oops ! Old Password doesn't match ",
            });

          if (req.body.newPass !== req.body.confirmPass) {
            return res.status(200).json({
              status: false,
              message: "Oops ! New Password and Confirm Password doesn't match",
            });
          }
          const hash = bcrypt.hashSync(req.body.newPass, 10);

          await Admin.updateOne(
            { _id: req.admin._id },
            { $set: { password: hash } }
          ).exec((error, updated) => {
            if (error)
              return res.status(200).json({
                status: false,
                message: error.message,
              });
            else
              return res.status(200).json({
                status: true,
                message: "Password changed Successfully",
              });
          });
        }
      });
    } else
      return res
        .status(200)
        .json({ status: false, message: "Invalid details" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//forgot password
exports.forgotPassword = async (req, res) => {
  try {
    console.log("----body", req.body);

    const admin = await Admin.findOne({ email: req.body.email });

    console.log("----admin", admin);

    if (!admin) {
      return res
        .status(200)
        .json({ status: false, message: "Email does not Exist!" });
    }

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.EMAIL,
        pass: config.PASSWORD,
      },
    });

    var tab = "";
    tab += "<!DOCTYPE html><html><head>";
    tab +=
      "<meta charset='utf-8'><meta http-equiv='x-ua-compatible' content='ie=edge'><meta name='viewport' content='width=device-width, initial-scale=1'>";
    tab += "<style type='text/css'>";
    tab +=
      " @media screen {@font-face {font-family: 'Source Sans Pro';font-style: normal;font-weight: 400;}";
    tab +=
      "@font-face {font-family: 'Source Sans Pro';font-style: normal;font-weight: 700;}}";
    tab +=
      "body,table,td,a {-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }";
    tab += "table,td {mso-table-rspace: 0pt;mso-table-lspace: 0pt;}";
    tab += "img {-ms-interpolation-mode: bicubic;}";
    tab +=
      "a[x-apple-data-detectors] {font-family: inherit !important;font-size: inherit !important;font-weight: inherit !important;line-height:inherit !important;color: inherit !important;text-decoration: none !important;}";
    tab += "div[style*='margin: 16px 0;'] {margin: 0 !important;}";
    tab +=
      "body {width: 100% !important;height: 100% !important;padding: 0 !important;margin: 0 !important;}";
    tab += "table {border-collapse: collapse !important;}";
    tab += "a {color: #1a82e2;}";
    tab +=
      "img {height: auto;line-height: 100%;text-decoration: none;border: 0;outline: none;}";
    tab += "</style></head><body>";
    tab += "<table border='0' cellpadding='0' cellspacing='0' width='100%'>";
    tab +=
      "<tr><td align='center' bgcolor='#e9ecef'><table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'>";
    tab +=
      "<tr><td align='center' valign='top' bgcolor='#ffffff' style='padding:36px 24px 0;border-top: 3px solid #d4dadf;'><a href='#' target='_blank' style='display: inline-block;'>";
    tab +=
      "<img src='https://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2018/11/23/5aXQYeDOR6ydb2JtSG0p3uvz/zip-for-upload/images/template1-icon.png' alt='Logo' border='0' width='48' style='display: block; width: 500px; max-width: 500px; min-width: 500px;'></a>";
    tab +=
      "</td></tr></table></td></tr><tr><td align='center' bgcolor='#e9ecef'><table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'><tr><td align='center' bgcolor='#ffffff'>";
    tab +=
      "<h1 style='margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;'>SET YOUR PASSWORD</h1></td></tr></table></td></tr>";
    tab +=
      "<tr><td align='center' bgcolor='#e9ecef'><table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'><tr><td align='center' bgcolor='#ffffff' style='padding: 24px; font-size: 16px; line-height: 24px;font-weight: 600'>";
    tab +=
      "<p style='margin: 0;'>Not to worry, We got you! Let's get you a new password.</p></td></tr><tr><td align='left' bgcolor='#ffffff'>";
    tab +=
      "<table border='0' cellpadding='0' cellspacing='0' width='100%'><tr><td align='center' bgcolor='#ffffff' style='padding: 12px;'>";
    tab +=
      "<table border='0' cellpadding='0' cellspacing='0'><tr><td align='center' style='border-radius: 4px;padding-bottom: 50px;'>";
    tab +=
      "<a href='" +
      config.baseURL +
      "changePassword/" +
      admin._id +
      "' target='_blank' style='display: inline-block; padding: 16px 36px; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 4px;background: #FE9A16; box-shadow: -2px 10px 20px -1px #33cccc66;'>SUBMIT PASSWORD</a>";
    tab +=
      "</td></tr></table></td></tr></table></td></tr></table></td></tr></table></body></html>";

    var mailOptions = {
      from: config.EMAIL,
      to: req.body.email,
      subject: "Sending Email from Flirtzy",
      html: tab,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        return res.status(200).json({
          status: true,
          message: "Email send successfully",
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//Set Admin Password
exports.setPassword = async (req, res, next) => {
  try {
    if (req.body.newPass || req.body.confirmPass) {
      Admin.findOne({ _id: req.params.adminId }).exec(async (err, admin) => {
        if (err)
          return res.status(200).json({ status: false, message: err.message });
        else {
          if (req.body.newPass !== req.body.confirmPass) {
            return res.status(200).json({
              status: false,
              message: "Oops ! New Password and Confirm Password doesn't match",
            });
          }
          bcrypt.hash(req.body.newPass, 10, (err, hash) => {
            if (err)
              return res.status(200).json({
                status: false,
                message: err.message,
              });
            else {
              Admin.update(
                { _id: req.params.adminId },
                { $set: { password: hash } }
              ).exec((error, updated) => {
                if (error)
                  return res.status(200).json({
                    status: false,
                    message: error.message,
                  });
                else
                  res.status(200).json({
                    status: true,
                    message: "Password Reset Successfully",
                  });
              });
            }
          });
        }
      });
    } else
      return res
        .status(200)
        .send({ status: false, message: "Invalid details!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};
