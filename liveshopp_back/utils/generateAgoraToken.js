const { RtcTokenBuilder, RtcRole } = require('agora-token');
const { DateTime } = require('luxon');
const appId = process.env.AGORA_APP_ID;
const appCertificate = process.env.AGORA_APP_CERTIFICATE;

const generateAgoraChannelToken = async (customerProfil, channelName, uid) => {
  const role = customerProfil === 'seller' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
  const privilegeExpiredTs = Math.floor(DateTime.now().plus({ hour: 1, minutes: 30 }).toSeconds());
  return {
    token: RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, 0, role, privilegeExpiredTs),
  };
};

module.exports = { generateAgoraChannelToken };
