'use strict';

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'respond'.
const respond = require('./responses');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = (context: any) => {
  respond.success(context, {
    message: 'OK'
  });
};
