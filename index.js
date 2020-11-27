
const core = require('@actions/core');
const github = require('@actions/github');
const Axios = require('axios');




const comment_report = async (context, issue_number, message) => {
    const author = context.payload.sender.login;

    const octokit = github.getOctokit(github_token);
    const comment = await octokit.issues.createComment({
        issue_number: issue_number,
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        body: message
    });
}

const run = () => {
    console.log("workflow started....");

    const github_token = core.getInput('GITHUB_TOKEN', { required: true });
    const issue_number = core.getInput('issue_number', { required: true });
    const options = core.getInput('options', { required: true });

    const context = github.context;
    console.log(context);

    comment_report(context, issue_number, "hi there :tada:");

}

run();