
const core = require('@actions/core');
const github = require('@actions/github');
const { exec } = require("child_process");


const run_command = async (options) => {
    const command = `cloc ${options}`
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}

const comment_report = async (context, github_token, issue_number, message) => {
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
    const github_token = core.getInput('GITHUB_TOKEN', { required: true });
    const issue_number = core.getInput('issue_number', { required: true });
    const options = core.getInput('options', { required: true });

    const context = github.context;

    run_command(options).then((data) => {
        comment_report(context, github_token, issue_number, "hi there :tada:");
    }).catch((err) => {
        console.log(err);
    })


}

run();