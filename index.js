const core = require('@actions/core');
const github = require('@actions/github');
const execa = require('execa');
const fs = require('fs');


function run_command(options) {
    const options_array = options.split(' ');
    try {
        execa.sync('cloc', options_array);
        console.log(`command run`);
    } catch (error) {
        throw new Error(`Failed to execute error: ${{ error }}`);

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

    run_command(options);
    var report_text = "";

    try {
        report_text = fs.readFileSync('report.md', 'utf-8');
    } catch (error) {
        throw new Error(`Failed to read the report: ${{ error }}`);
    }

    await comment_report(context, github_token, issue_number, report_text);



}

run();