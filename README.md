# Aura Weather

Existing weather applications rely heavily on internet connectivity to retrieve real-time weather information, making them unusable in offline environments.

Most weather systems depend on third-party APIs, which may have request limits, subscription costs, or service interruptions that affect application performance.

Developers face difficulties in testing weather applications when live API services are unavailable or unstable during development.

Many desktop weather applications provide limited user interaction and lack a simple, intuitive graphical interface for displaying weather

information.



For this problem give me as prompt for solution and to the lovable.ai



Here's a detailed prompt you can paste directly into Lovable.ai to build this solution:



Prompt for Lovable.ai:



Build a desktop-style offline-first weather application that solves the common problems of internet-dependent weather apps. The app should work fully without live internet access by using a local/mock weather data layer, while still supporting real API integration when available.



Core Requirements:



Offline-First Architecture

Store a local dataset (JSON) of sample weather data for multiple cities, covering various conditions (sunny, rainy, cloudy, stormy, snowy) and a 7-day forecast structure.

App should detect internet connectivity status and automatically switch between "Live API mode" and "Offline/Mock mode" without crashing or showing errors.

Cache the last successfully fetched live weather data locally, so if the connection drops, the app falls back to the most recent cached data instead of failing.

Decoupled Data Layer for Easy Testing

Create a clean abstraction (a WeatherService interface/module) with two implementations: MockWeatherService and LiveWeatherService (using a free API like OpenWeatherMap).

This lets developers toggle a config flag (USE_MOCK_DATA = true/false) to test the UI without needing live API calls, avoiding rate limits or subscription issues during development.

No Hard Dependency on Paid/Rate-Limited APIs

Design the app so the live API is optional/pluggable, not mandatory. If no API key is configured, default to mock data seamlessly.

Include a settings panel where users can add their own free-tier API key later.

Simple, Intuitive Graphical Interface

Clean, modern dashboard layout showing: current temperature, condition icon, humidity, wind speed, and a 5–7 day forecast strip.

City search/selection dropdown (searchable from the local dataset when offline).

Toggle for °C/°F units.

Visual indicator showing whether the app is in "Live" or "Offline" mode.

Responsive, minimal design with weather-condition-based background themes (e.g., sunny = warm gradient, rainy = blue/grey gradient).

Tech Preferences

Frontend: React (or your default stack) with a component-based structure (WeatherCard, ForecastList, SearchBar, ModeIndicator).

Local storage/IndexedDB for caching last-fetched data.

Well-commented code so developers can easily extend the mock dataset or swap in a different live API.



Goal: Deliver a weather app that never fully breaks due to connectivity issues, is easy for developers to test without live API dependency, and gives end users a clean, functional interface regardless of network state.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/fa06f3eb-046c-4985-ae93-6ce26adc75a8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
