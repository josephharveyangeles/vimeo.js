'use strict'

/**
 *   Copyright 2013 Vimeo
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

var Vimeo = require('../index').Vimeo

try {
  var config = require('./config.json')
} catch (error) {
  console.error('ERROR: For this example to run properly you must create an API app at ' +
    'https://developer.vimeo.com/apps/new and set your callback url to http://localhost:8080/oauth_callback')
  console.error('ERROR: Once you have your app, make a copy of `config.json.example` named `config.json` and add ' +
    'your client ID, client secret and access token.')
  process.exit()
}

var lib = new Vimeo(config.client_id, config.client_secret)
if (!config.access_token) {
  throw new Error('You can not upload a video without configuring an access token.')
}

// The file to upload should be passed in as the first argument to this script
var filePath = process.argv[2]

// This variable, and the logic related to it helps ensure we only log the percentage if the percentage has changed.
var prevPercentage = -1

lib.access_token = config.access_token
lib.streamingUpload(
  filePath,
  function (err, body, status, headers) {
    if (err) {
      return console.log(err)
    }

    console.log(status)
    console.log(headers.location)
  },
  function (uploadedSize, fileSize) {
    var percentage = Math.round((uploadedSize / fileSize) * 100)

    if (percentage !== prevPercentage) {
      console.log(percentage + '%' + ' uploaded\n')
      prevPercentage = percentage
    }
  }
)
