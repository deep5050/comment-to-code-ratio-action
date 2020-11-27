const core = require('@actions/core');
const github = require('@actions/github');
const { exec } = require("child_process");
const fs = require('fs');


const run_command = async (options) => {
    console.log("Running command");
    const command = `cloc ${options}`
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return '';
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return '';
        }
        // console.log(`stdout: ${stdout}`);
        console.log("commad succeed");
    });
}



const comment_report = async (context, github_token, issue_number, message) => {
    console.log("commenting");
    const author = context.payload.sender.login;

    const octokit = github.getOctokit(github_token);
    const comment = await octokit.issues.createComment({
        issue_number: issue_number,
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        body: message
    });
    console.log("commented");
}


const run = async() => {
    const github_token = core.getInput('GITHUB_TOKEN', { required: true });
    const issue_number = core.getInput('issue_number', { required: true });
    const options = core.getInput('options', { required: true });

    const context = github.context;
    
    await run_command(options);
    const data = fs.readFileSync('./report.md');
    console.log(data)
    await comment_report(context,github_token,issue_number,data);
}

run();