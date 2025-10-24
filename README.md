# Hybrid Application Tracking System (HATS)

## Overview
HATS is a full-stack role-based application tracking system designed for technical roles with automated workflow updates. This project features:
- Role-based login and registration (admin, bot mimic, applicant)
- Applicants can apply for jobs
- Admin and bot mimic users can update application statuses manually or via automated Bot Mimic scripts
- Detailed comment history tracks manual and automated status changes
- Frontend UI built with React and Bootstrap for professional styling
- Backend API built with Node.js, Express, MongoDB

## Features Implemented (Milestone 2)

- User authentication and authorization using JWT
- Application submission by applicants only; admin and bot mimic cannot apply
- Applications listing filtered by role; applicants see their own, admin/bot see all
- Manual status updates by admin and bot mimic with comments logging who updated what
- UI to display application details with comprehensive update history
- Sample Bot Mimic automation code to simulate automated status progressions and comments (to be scheduled or triggered)
- Full version control setup in a single monorepo (frontend + backend)

## Project Structure

```
/ (root)
  /backend           # Express API, MongoDB models, authentication middleware
  /frontend          # React app with context, routing, and components
  README.md          # This documentation
  .gitignore
  package.json       # npm configs (frontend/backend may have their own)
```

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm or yarn
- MongoDB (Local or Atlas cluster)
- Git for version control

### Installation

1. Clone the repo

```sh
git clone https://github.com/your-username/HATS.git
cd HATS
```

2. Setup Backend

```sh
cd backend
npm install
# Create .env file with your MongoDB URI, JWT secret, and other configs
npm start
```

3. Setup Frontend

```sh
cd ../frontend
npm install
npm start
```

4. Access the frontend on `http://localhost:3000/` and backend API on your backend port (default 5000)

## Usage

- Register as an applicant/admin/bot
- Applicants can apply to jobs and view their own applications
- Admin and bot mimic can update application status manually via UI
- Bot Mimic automation script simulates automatic status updates in backend (can be scheduled)

## Notes

- Ensure your `.env` file is configured correctly for MongoDB and JWT secret
- The Bot Mimic automation is sample code; scheduling the automation is future work
- Use Git and GitHub to track project versions; milestone 2 corresponds to the current stable version

## Contributing

Feel free to fork and contribute via pull requests. Please maintain coding conventions and add tests if applicable.

## License

This project is open source.

***

This README captures the full context and usage instructions for your current codebase milestone. You can update the GitHub `README.md` file with this content to help future users understand and run your project.

[1](https://github.com/othneildrew/Best-README-Template)
[2](https://github.com/monorepo-template/monorepo-template)
[3](https://github.com/durgeshsamariya/awesome-github-profile-readme-templates)
[4](https://github.com/topics/readme-template)
[5](https://github.com/sst/monorepo-template)
[6](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes)
[7](https://www.youtube.com/watch?v=eVGEea7adDM)
[8](https://github.com/CarlosZiegler/monorepo-template)
[9](https://www.reddit.com/r/programming/comments/l0mgcy/github_readme_templates_creating_a_good_readme_is/)
[10](https://www.reddit.com/r/webdev/comments/18sozpf/how_do_you_write_your_readmemd_or_docs_for_your/)
