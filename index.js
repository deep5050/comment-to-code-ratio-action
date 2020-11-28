const core = require('@actions/core');
const github = require('@actions/github');
const exace = require('execa');
const fs = require('fs');


const run_command = (options) => {
    console.log("Running command");
    try {
        var options_array = options.split(' ');
        execa.sync('cloc', options_array);
        execa
    } catch (error) {
        throw new Error(`Faild to execute the command: ${{ error }}`);
    }
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


const run = async () => {
    const github_token = core.getInput('GITHUB_TOKEN', { required: true });
    const issue_number = core.getInput('issue_number', { required: true });
    const options = core.getInput('options', { required: true });
    const context = github.context;

    try {
        run_command(options);
        const report_text = fs.readFileSync('report.md', 'utf-8');
        await comment_report(context, github_token, issue_number, report_text);
    } catch (error) {
        throw new Error(`Failed to read the file: ${{ error }}`)
    }

}

run();