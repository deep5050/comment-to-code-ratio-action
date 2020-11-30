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
        core.setFailed(`Error in running the command: ${error.message}`);
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

    core.debug(`Sucessfully commented on the target issue`);
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
        core.setFailed(`Error in reading the file: ${error.message}`);
    }


    var lines = report_text.split('\n');
    lines.splice(0, 3);
    report_text = lines.join('\n');

    const fixed_footer = `
 Horribly commented code averages 0-5% comment ratio.

 Poorly commented code has a 5-10% comment ratio.

 Average code has a 10-15% comment ratio.

 Good code has a 15-25% comment ratio.

 Excellent code has a > 25% comment ratio.


 Use [this action](https://github.com/deep5050/comment-to-code-ratio-action) on your projects to generate a report like this.`;

    var modified_data = `#### comment-to-code-ratio analysis report for the last push :tada:
        
 ${report_text}

 ${fixed_footer}`;

    try {
        fs.writeFileSync('report.md', modified_data)
    } catch (error) {
        core.setFailed(`Error in writing the file: ${error.message}`);
    }

    await comment_report(context, github_token, issue_number, modified_data);
}

run();