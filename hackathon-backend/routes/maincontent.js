const {sendMail} = require('./mail.js'); 

// Send welcome email
const sendJoinEmail = (userEmail) => {
    const subject = 'Welcome to our platform!';
    const body = 'Thank you for joining our platform. We are happy to have you!';
    sendMail(userEmail, subject, body);
};

// Send leave email
const sendLeaveEmail = (userEmail) => {
    const subject = 'We are sorry to see you go!';
    const body = 'Your account has been deactivated. We hope to see you again.';
    sendMail(userEmail, subject, body);
};

// Send status update email
const sendStatusUpdateEmail = (userEmail, status) => {
    const subject = 'Your status has been updated';
    const body = `Your account status is now: ${status}`;
    sendMail(userEmail, subject, body);
};

// Send team creation email
const sendTeamCreationEmail = (userEmail, teamName, teamLeader) => {
    const subject = `Welcome to the Team: ${teamName}`;
    const body = `
        <p>Dear ${teamLeader},</p>
        <p>Congratulations! You've successfully created a team named <strong>${teamName}</strong>.</p>
        <p>We wish you success in your journey as a team.</p>
    `;
    sendMail(userEmail, subject, body);
};

// Send team join request email
const sendJoinRequestEmail = (teamLeaderEmail, teamName, userName) => {
    const subject = `${userName} has requested to join your team: ${teamName}`;
    const body = `
        <p>Dear Team Leader,</p>
        <p>${userName} has sent a join request to your team <strong>${teamName}</strong>.</p>
        <p>Please review the request and take appropriate action.</p>
    `;
    sendMail(teamLeaderEmail, subject, body);
};

// Send team approval email
const sendApprovalEmail = (userEmail, teamName) => {
    const subject = `Your request to join ${teamName} has been approved!`;
    const body = `
        <p>Dear User,</p>
        <p>Congratulations! Your request to join the team <strong>${teamName}</strong> has been approved.</p>
        <p>Welcome aboard!</p>
    `;
    sendMail(userEmail, subject, body);
};

// Send team rejection email
const sendRejectionEmail = (userEmail, teamName) => {
    const subject = `Your request to join ${teamName} has been rejected`;
    const body = `
        <p>Dear User,</p>
        <p>Unfortunately, your request to join the team <strong>${teamName}</strong> has been rejected.</p>
        <p>Feel free to explore other teams!</p>
    `;
    sendMail(userEmail, subject, body);
};

// Send member removal email
const sendRemoveMemberEmail = (userEmail, teamName) => {
    const subject = `You have been removed from ${teamName}`;
    const body = `
        <p>Dear User,</p>
        <p>We regret to inform you that you have been removed from the team <strong>${teamName}</strong>.</p>
        <p>If you have any questions, please reach out to your team leader.</p>
    `;
    sendMail(userEmail, subject, body);
};

// Send status update email
const sendStatusChangeEmail = (userEmail, status) => {
    const subject = 'Your account status has been updated';
    const body = `Your status is now: ${status}`;
    sendMail(userEmail, subject, body);
};

// Export all the functions
module.exports = {
    sendJoinEmail,
    sendLeaveEmail,
    sendStatusUpdateEmail,
    sendTeamCreationEmail,
    sendJoinRequestEmail,
    sendApprovalEmail,
    sendRejectionEmail,
    sendRemoveMemberEmail,
    sendStatusChangeEmail,
};
