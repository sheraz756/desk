const Host = require("./host.model");
const fs = require("fs");

const { baseURL } = require("../../config");

//All Host Get API [Backend]
exports.hostGet = async (req, res) => {
  try {
    const host = await Host.find();

    return res
      .status(200)
      .json({ status: true, message: "Host Data Get Successfully!!", host });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: error.message || "Internal Sever Error!!",
    });
  }
};

//Host Login API [App]
exports.login = async (req, res) => {
  try {
    if (req.body.loginType == 0) {
      if (!req.body.identity) {
        return res
          .status(200)
          .json({ status: false, message: "identity is required!!" });
      }

      const host = await Host.findOne({ identity: req.body.identity });

      if (!host) {
        return res
          .status(200)
          .json({ status: false, message: "Host does not found!!" });
      }

      if (host) {
        host.fcm_token = req.body.fcm_token;
        host.platformType = req.body.platformType;
        host.lastLogin = new Date().toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
        });
        host.date = new Date().toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
        });
        host.loginType = req.body.loginType;
        host.identity = req.body.identity;
        host.country = req.body.country;

        await host.save();

        return res
          .status(200)
          .json({ status: true, message: "host login Successfully!!", host });
      }
    } else if (req.body.loginType == 1) {
      if (!req.body.email) {
        return res
          .status(200)
          .json({ status: false, message: "Email is required!" });
      }

      const host = await Host.findOne({ email: req.body.email });

      if (!host) {
        return res
          .status(200)
          .json({ status: false, message: "Host does not found !" });
      }

      if (host) {
        host.fcm_token = req.body.fcm_token;
        host.name = req.body.name ? req.body.name : host.name;
        host.platformType = req.body.platformType;
        host.lastLogin = new Date().toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
        });
        host.date = new Date().toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
        });
        host.loginType = req.body.loginType;
        host.identity = req.body.identity;
        host.country = req.body.country;

        await host.save();

        return res
          .status(200)
          .json({ status: true, message: "host login Successfully!!", host });
      }
    } else if (req.body.loginType == 2) {
      if (!req.body.uniqueID) {
        return res
          .status(200)
          .json({ status: false, message: "Unique Id is required!!" });
      }

      if (!req.body.password) {
        return res
          .status(200)
          .json({ status: false, message: "Password is required!!" });
      }

      const host = await Host.findOne({ uniqueID: req.body.uniqueID });

      if (!host)
        return res
          .status(200)
          .json({ status: false, message: "HostId is Incorrect!" });

      if (host.password !== req.body.password)
        return res
          .status(200)
          .json({ status: false, message: "Password is Incorrect" });

      host.fcm_token = req.body.fcm_token;
      host.identity = req.body.identity;
      host.platformType = req.body.platformType;
      host.loginType = req.body.loginType;
      host.lastLogin = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      });
      host.date = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      });
      host.country = req.body.country;

      await host.save();

      return res
        .status(200)
        .json({ status: true, message: "host login Successfully!!", host });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: error.message || "Internal Sever Error!!",
    });
  }
};

//get host profile who login [App,Backend]
exports.getProfile = async (req, res) => {
  try {
    if (!req.query.hostId)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!!" });

    const hostExist = await Host.findById(req.query.hostId);

    if (!hostExist)
      return res
        .status(200)
        .json({ status: false, message: "Host does not found!!" });

    return res
      .status(200)
      .json({ status: true, message: "Success!!", hostExist });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error!!",
    });
  }
};

//update profile of host for [backend]
exports.updateHostProfile = async (req, res) => {
  try {
    if (!req.query.hostId)
      return res
        .status(200)
        .json({ status: false, message: "Invalid details!!" });

    const host = await Host.findById(req.query.hostId);

    if (!host)
      return res
        .status(200)
        .json({ status: false, message: "Host does not found!!" });

    host.name = req.body.name ? req.body.name : host.name;
    host.gender = req.body.gender ? req.body.gender : host.gender;
    host.bio = req.body.bio ? req.body.bio : host.bio;
    host.dob = req.body.dob ? req.body.dob : host.dob;
    host.mobileNumber = req.body.mobileNumber
      ? req.body.mobileNumber
      : host.mobileNumber;
    host.country = req.body.country
      ? req.body.country.toLowerCase().trim()
      : host.country;
    host.age = req.body.age ? req.body.age : host.age;
    host.coin = req.body.coin ? req.body.coin : host.coin;
    host.password = req.body.password ? req.body.password : host.password;
    host.email = req.body.email ? req.body.email : host.email;

    if (req.files.image) {
      console.log("-------image", host.image);
      if (host.image) {
        const image = host.image.split("storage");

        if (image[1] !== "/male.png" && image[1] !== "/female.png") {
          if (image) {
            if (fs.existsSync("storage" + image[1])) {
              fs.unlinkSync("storage" + image[1]);
            }
          }
        }
      }
      host.image = baseURL + req.files.image[0].path;
    }

    if (req.body.album || req.files.album) {
      var albumData = [];

      if (req.body.album) {
        if (typeof req.body.album === "string") {
          albumData.push(req.body.album);
        } else {
          albumData = req.body.album;
        }
      }

      if (req.files.album) {
        if (host.album.length > 0) {
          for (var i = 0; i < host.album.length; i++) {
            const album = host.album[i].split("storage");
            if (album) {
              if (album[1] != "/male.png" && album[1] != "/female.png") {
                if (album) {
                  if (fs.existsSync("storage" + album[1])) {
                    fs.unlinkSync("storage" + album[1]);
                  }
                }
              }
            }
          }
        }

        await req.files.album.map((data) => {
          console.log("map ma aavyu!!");
          albumData.push(baseURL + data.path);
        });
      }
      host.album = albumData;
    }

    await host.save();

    const host_ = await Host.findById(host._id);

    return res.status(200).json({ status: true, message: "Success!!", host_ });
  } catch (error) {
    if (req.files) deleteFile(req.files);
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error!!",
    });
  }
};

//update profile of host for [App]
exports.updateProfile = async (req, res) => {
  try {
    if (!req.body.hostId)
      return res
        .status(200)
        .json({ status: false, message: "Invalid details!!" });

    const host = await Host.findById(req.body.hostId);

    if (!host)
      return res
        .status(200)
        .json({ status: false, message: "Host does not Exist!!" });

    host.name = req.body.name ? req.body.name : host.name;
    host.gender = req.body.gender
      ? req.body.gender.toLowerCase().trim()
      : host.gender;
    host.bio = req.body.bio ? req.body.bio : host.bio;
    host.dob = req.body.dob ? req.body.dob : host.dob;
    host.password = req.body.password ? req.body.password : host.password;
    host.mobileNumber = req.body.mobileNumber
      ? req.body.mobileNumber
      : host.mobileNumber;
    host.age = req.body.age ? parseInt(req.body.age) : host.age;
    // host.country = req.body.country
    //   ? req.body.country.toLowerCase().trim()
    //   : host.country;

    if (req.files.image) {
      console.log("-------image", host.image);
      if (host.image) {
        const image = host.image.split("storage");

        if (image[1] !== "/male.png" && image[1] !== "/female.png") {
          if (image) {
            if (fs.existsSync("storage" + image[1])) {
              fs.unlinkSync("storage" + image[1]);
            }
          }
        }
      }
      host.image = baseURL + req.files.image[0].path;
    }

    await host.save();

    return res.status(200).json({ status: true, message: "Success!!", host });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error!!",
    });
  }
};

//Update Host Image, CoverImage and Album [App]
exports.updateHostImage = async (req, res) => {
  try {
    if (!req.body.hostId) {
      return res
        .status(200)
        .json({ status: false, message: "Host Id is required!!" });
    }

    const host = await Host.findById(req.body.hostId);

    if (!host) {
      if (req.files) deleteFile(req.files);
      return res
        .status(200)
        .json({ status: false, message: "Host does not found!!" });
    }

    if (!req.files) {
      return res
        .status(200)
        .json({ status: false, message: "Oops ! Files is required!!" });
    }

    if (req.files.image) {
      console.log("-------image", host.image);
      if (host.image) {
        const image = host.image.split("storage");

        if (image[1] !== "/male.png" && image[1] !== "/female.png") {
          if (image) {
            if (fs.existsSync("storage" + image[1])) {
              fs.unlinkSync("storage" + image[1]);
            }
          }
        }
      }
      host.image = baseURL + req.files.image[0].path;
    }

    if (req.files.coverImage) {
      console.log("-------coverImage", host.coverImage);
      if (host.coverImage) {
        const coverImage = host.coverImage.split("storage");

        if (coverImage[1] !== "/male.png" && coverImage[1] !== "/female.png") {
          if (coverImage) {
            if (fs.existsSync("storage" + coverImage[1])) {
              fs.unlinkSync("storage" + coverImage[1]);
            }
          }
        }
      }
      host.coverImage = baseURL + req.files.coverImage[0].path;
    }

    if (req.body.album || req.files.album) {
      var albumData = [];

      if (req.body.album) {
        if (typeof req.body.album === "string") {
          albumData.push(req.body.album);
        } else {
          albumData = req.body.album;
        }
      }

      if (req.files.album) {
        if (host.album.length > 0) {
          for (var i = 0; i < host.album.length; i++) {
            const album = host.album[i].split("storage");
            if (album) {
              if (album[1] != "/male.png" && album[1] != "/female.png") {
                if (album) {
                  if (fs.existsSync("storage" + album[1])) {
                    fs.unlinkSync("storage" + album[1]);
                  }
                }
              }
            }
          }
        }

        await req.files.album.map((data) => {
          console.log("map ma aavyu!!");
          albumData.push(baseURL + data.path);
        });
      }
      host.album = albumData;
    }

    await host.save();

    return res.status(200).json({
      status: true,
      message: "Success!!",
      hostImage: host,
    });
  } catch (error) {
    console.log(error);
    if (req.files) deleteFile(req.files);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error!!",
    });
  }
};

//delete Host Album
exports.deleteHostAlbum = async (req, res) => {
  try {
    if (!req.query.hostId) {
      return res
        .status(200)
        .json({ status: false, message: "Host Id is required!!" });
    }

    const host = await Host.findById(req.query.hostId);

    if (!host) {
      return res
        .status(200)
        .json({ status: false, message: "Host does not found!!" });
    }

    const album =
      host.album.length > 0 &&
      host.album[req.query.position] !== undefined &&
      host.album[req.query.position].split("storage");

    if (album) {
      if (fs.existsSync("storage" + album[1])) {
        fs.unlinkSync("storage" + album[1]);
      }
    }

    const albumLink = host.album[req.query.position];

    host.album = host.album.filter((data) => data !== albumLink);

    await host.save();

    return res.status(200).json({
      status: true,
      message: "Success!!",
      host,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error!!",
    });
  }
};

//Get countryWise Host Thumb List [App]
exports.getHostThumbList = async (req, res) => {
  try {
    if (!req.query.countryName) {
      return res
        .status(200)
        .json({ status: false, message: "Country name is required!!!" });
    }

    var matchQuery;
    if (req.query.countryName === "Global") {
      matchQuery = { isOnline: true };
    } else {
      matchQuery = {
        $and: [
          {
            country: req.query.countryName,
          },
          {
            isOnline: true,
          },
        ],
      };
    }
    console.log("------", matchQuery);
    const host = await Host.aggregate([
      {
        $match: matchQuery,
      },
      {
        $addFields: {
          status: {
            $cond: {
              if: {
                $and: [
                  { $eq: ["$isOnline", true] },
                  { $eq: ["$isLive", false] },
                  { $eq: ["$isBusy", false] },
                ],
              },
              then: "Online",
              else: {
                $cond: {
                  if: {
                    $and: [
                      { $eq: ["$isOnline", true] },
                      { $eq: ["$isLive", true] },
                      { $eq: ["$isBusy", true] },
                    ],
                  },
                  then: "Live",
                  else: {
                    $cond: {
                      if: {
                        $and: [
                          { $eq: ["$isOnline", true] },
                          { $eq: ["$isLive", false] },
                          { $eq: ["$isBusy", true] },
                        ],
                      },
                      then: "Busy",
                      else: "",
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          country: 1,
          image: 1,
          coin: 1,
          album: 1,
          coverImage: 1,
          token: 1,
          channel: 1,
          status: 1,
          liveStreamingId: 1,
          agoraUid: 1,
        },
      },
    ]);
    return res.status(200).json({ status: true, message: "Success!!", host });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error!!",
    });
  }
};

//host isOnline or not
exports.isOnline = async (req, res) => {
  try {
    if (!req.query.hostId) {
      return res
        .status(200)
        .json({ status: false, message: "Host Id is required!!" });
    }

    const host = await Host.findById(req.query.hostId);

    if (!host) {
      return res
        .status(200)
        .json({ status: false, message: "No Host Was Found!!" });
    }

    // host.isOnline = !host.isOnline;

    if (host.isOnline == true) {
      host.isOnline = false;
      host.isBusy = false;
      host.isLive = false;
    } else {
      host.isOnline = true;
    }

    await host.save(async (error, host) => {
      if (error) {
        return res
          .status(200)
          .json({ status: false, message: "Server Error!!" });
      } else {
        return res
          .status(200)
          .json({ status: true, message: "Success!!", host });
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error!!",
    });
  }
};

//block or unblock the host(disable the host)
exports.blockHost = async (req, res) => {
  try {
    if (!req.query.hostId) {
      return res
        .status(200)
        .json({ status: false, message: "HostId is requried!!" });
    }

    const host = await Host.findById(req.query.hostId);

    if (!host) {
      return res
        .status(200)
        .json({ status: false, message: "Host does not exist!!" });
    }

    host.isBlock = !host.isBlock;

    await host.save();

    return res.status(200).json({
      status: true,
      message: "Success!!",
      host,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error!!",
    });
  }
};

exports.addAlbum = async (req, res) => {
  try {
    if (!req.query.hostId) {
      return res
        .status(200)
        .json({ status: false, message: "HostId is required!!" });
    }

    const host = await Host.findById(req.query.hostId);

    if (!host) {
      return res
        .status(200)
        .json({ status: false, message: "Host does not exist!!" });
    }

    if (!req.file) {
      return res.status(200).json({ status: false, message: "Select Image!!" });
    }

    const imageData = [];
    imageData.unshift(baseURL + req.file.path);

    host.album = [...host.album, ...imageData];
    await host.save();

    // await req.files.album.map((data) => {
    //   console.log("map ma aavyu ");
    //   imageData.unshift(baseURL + data.path);
    // });

    // host.album = imageData;
    // await host.save();

    return res.status(200).json({
      status: true,
      message: "Success!!",
      imageData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error!!",
    });
  }
};

exports.deleteAlbum = async (req, res) => {
  try {
    console.log("req.file", req.file);

    if (!req.query.hostId) {
      return res
        .status(200)
        .json({ status: false, message: "HostId is required!!" });
    }

    const host = await Host.findById(req.query.hostId);

    if (!host) {
      return res
        .status(200)
        .json({ status: false, message: "Host does not exist!!" });
    }

    if (!req.query.position) {
      return res
        .status(200)
        .json({ status: false, message: "position Is required !!" });
    }

    host.album.splice(req.query.position, 1);
    await host.save();

    return res.status(200).json({
      status: true,
      message: "Success!!",
      host,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error!!",
    });
  }
};
