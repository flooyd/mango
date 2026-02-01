# Mango - Dota 2 Replay Navigator ![Mango](https://static.wikia.nocookie.net/dota2_gamepedia/images/7/70/Enchanted_Mango_icon.png/revision/latest/scale-to-width-down/100?cb=20160530170213)

https://youtu.be/4bifPWVjVS4

Browse replays, see scoreboard, kills, etc. and navigate to kills, etc. in realtime using automatic commands sent to the Dota 2 in-game console.

![alt text](https://raw.githubusercontent.com/flooyd/mango/refs/heads/master/client/public/image.png)


AI GENERATED DESCRIPTION USING QWEN3-CODER ON CLAUDE CODE WITH OLLAMA. THIS TOOK 30 MINUTES TO GENERATE USING A LOCAL MODEL :(

Project Description: Mango - Dota 2 Replay Navigator                                                                                                                                                     
  This is a web-based application that allows users to browse, analyze, and navigate through Dota 2 replay files. The application is built with a Node.js/TypeScript backend using NestJS and a Svelte
  frontend.

  Key Features

  1. Replay Browsing: Users can view a list of available Dota 2 replay files from their local Dota 2 installation directory
  2. Match Analysis: Detailed match data including player information, kills, items, chat messages, and game statistics
  3. Real-time Navigation: Interactive navigation through matches using the Dota 2 in-game console
  4. Automated Parsing: Parses replay files using an external Java-based parser (odotaparser)

  Architecture

  Backend (NestJS)

  - Database: PostgreSQL database for storing match details and summaries
  - API Endpoints:
    - /replays - List available replays
    - /matches/details/:matchId - Get detailed match information
    - /matches/summary/:matchId - Get match summary data
    - /navigation - Control Dota 2 game interaction

  Frontend (Svelte)

  - User Interface: Web-based interface for browsing replays and viewing match details
  - Interactive Features:
    - Replay selection
    - Match detail viewing
    - Navigation controls to jump to specific points in matches

  How It Works

  1. The application scans a specific directory for Dota 2 replay files (C:/Program Files (x86)/Steam/steamapps/common/dota 2 beta/game/dota/replays)
  2. When a replay is selected, it's parsed using an external Java-based parser
  3. The parsed data is stored in a PostgreSQL database
  4. Users can view detailed match information including kills, items, chat messages, and player statistics
  5. The application can interact with the running Dota 2 game through:
    - playdemo command to load replays
    - demo_gototick command to navigate to specific points in matches
    - Window management to bring the game to the foreground

  Technical Components

  Backend Services

  - ReplaysService: Handles replay file operations, parsing, and database storage
  - MatchesService: Retrieves and processes match data from the database
  - NavigationService: Controls interaction with the Dota 2 game window using node-window-manager and robotjs

  Key Dependencies

  - @nestjs/* - Framework for building scalable server-side applications
  - typeorm - ORM for database operations
  - node-window-manager - For window management
  - robotjs - For keyboard automation
  - copy-paste - For clipboard operations
  - pg - PostgreSQL client

  Data Storage

  - PostgreSQL database with two main entities:
    - MatchDetails: Stores full match data including parsed replay content
    - MatchSummary: Stores summary information for quick browsing

  Functionality

  The application enables users to:
  1. Browse their local Dota 2 replay files
  2. View detailed match information including kills, items, chat messages, and player stats
  3. Navigate through matches in real-time by sending commands to the Dota 2 in-game console
  4. Jump to specific points in matches using tick-based navigation

  This is a sophisticated tool for Dota 2 replay analysis that bridges the gap between replay files and interactive gameplay navigation.

