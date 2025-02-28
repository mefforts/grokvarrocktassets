# OSRS Trivia Game

A web and mobile-friendly trivia game based on Old School RuneScape knowledge. Test your understanding of the game, earn XP, and level up just like in OSRS!

## Features

- **Multiple Difficulty Levels**: From Beginner to Master, just like clue scrolls!
- **Various Question Categories**: Items, NPCs, Locations, Quests, Skills, and Lore.
- **OSRS XP System**: Level up following the same XP curve as OSRS (92 is half of 99!).
- **Leaderboards**: Compete with other players for the top spots.
- **User Profiles**: Track your progress and see detailed stats.
- **Mobile Responsive**: Play on any device!
- **Clue Scroll-Themed UI**: Nostalgic interface inspired by OSRS treasure trails.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Setup for Development

1. Clone the repository
2. Install dependencies with `npm install`
3. Make sure MongoDB is installed and running
4. Configure environment variables (see `.env.example`)
5. Run the development server with `npm start`
6. Import sample questions with `node scripts/importQuestions.js`

## Directory Structure

```
grokvarrocktassets/
├── public/               # Static files
│   ├── css/              # Stylesheets
│   ├── js/               # Client-side JavaScript
│   ├── images/           # Game images
│   └── *.html            # HTML pages
├── server/               # Server-side code
│   ├── db/               # Database models and connection
│   ├── routes/           # API routes
│   └── utils/            # Utility functions
├── data/                 # Game data
├── scripts/              # Utility scripts
├── server.js             # Main server file
└── package.json          # Node.js dependencies
```

## Contributing

Contributions are welcome! If you'd like to add more questions, improve the UI, or fix bugs, please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This is a fan-made project and is not affiliated with Jagex. All OSRS-related content belongs to Jagex Ltd.

## Credits

- Question data sourced from the OSRS Wiki and community knowledge
- Images used are from the OSRS Wiki and are property of Jagex