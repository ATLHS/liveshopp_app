const { RtcTokenBuilder, RtcRole } = require('agora-token');
const { DateTime } = require('luxon');
const appId = process.env.AGORA_APP_ID;
const appCertificate = process.env.AGORA_APP_CERTIFICATE;
const privilegeExpiredTs = DateTime.now().plus({ hour: 1, minutes: 30 }).toSeconds();

const generateAgoraChannelToken = async (customerProfil, channelName, uid) => {
  const role = customerProfil === 'seller' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
  return {
    token: RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, 0, role, privilegeExpiredTs),
  };
};

module.exports = { generateAgoraChannelToken };
