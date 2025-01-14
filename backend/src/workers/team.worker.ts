import { faker } from "@faker-js/faker";
import { teamService } from "../services/team.service";
import { playerService } from "../services/player.service";

process.on("message", async (data: { userId: string }) => {
  const { userId } = data;

  // Step 1: Create a new team
  const teamName = generateTeamName();
  const team = await teamService.create(teamName, userId);

  // Step 2: Generate and assign players
  const players = [
    ...generatePlayers("Goalkeeper", 3),
    ...generatePlayers("Defender", 6),
    ...generatePlayers("Midfielder", 6),
    ...generatePlayers("Attacker", 5),
  ];
  await playerService.createMany(players, team.id);

  process.exit(0);
});

function generateTeamName() {
  const adjective = faker.word.adjective(); // Random adjective
  const animal = faker.animal.type(); // Random animal
  const location = faker.location.city(); // Random city

  // Combine them into different formats to make a unique team name
  const formats = [
    `${adjective} ${animal}`,
    `${location} ${animal}`,
    `${adjective} ${location}`,
    `The ${adjective} ${animal}`,
  ];

  // return a random format
  return formats[Math.floor(Math.random() * formats.length)];
}

function generatePlayers(position: string, count: number) {
  return Array.from({ length: count }, () => ({
    name: faker.person.fullName({
      sex: "male",
    }),
    position,
    price: faker.number.int({ min: 100000, max: 5000000 }),
  }));
}
