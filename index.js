
const core = require('@actions/core');
const github = require('@actions/github');
const Axios = require('axios');

console.log("workflow started....");

const github_token = core.getInput('GITHUB_TOKEN',{required: true});


const context = github.context;

const author = context.payload.sender.login;
const repoOwner = context.payload.repository.owner.login;

console.log(context);