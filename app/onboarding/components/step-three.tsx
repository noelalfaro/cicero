import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { OnboardingFormValues } from '@/components/auth/onboarding-form';
import { UseFormReturn } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { MorphButton } from '@/components/auth/morph-button';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';

const nbaTeams = [
  'Atlanta Hawks',
  'Boston Celtics',
  'Brooklyn Nets',
  'Charlotte Hornets',
  'Chicago Bulls',
  'Cleveland Cavaliers',
  'Dallas Mavericks',
  'Denver Nuggets',
  'Detroit Pistons',
  'Golden State Warriors',
  'Houston Rockets',
  'Indiana Pacers',
  'LA Clippers',
  'Los Angeles Lakers',
  'Memphis Grizzlies',
  'Miami Heat',
  'Milwaukee Bucks',
  'Minnesota Timberwolves',
  'New Orleans Pelicans',
  'New York Knicks',
  'Oklahoma City Thunder',
  'Orlando Magic',
  'Philadelphia 76ers',
  'Phoenix Suns',
  'Portland Trail Blazers',
  'Sacramento Kings',
  'San Antonio Spurs',
  'Toronto Raptors',
  'Utah Jazz',
  'Washington Wizards',
];

const nbaGreats = [
  // Top Tier (GOAT Candidates)
  'LeBron James',
  'Michael Jordan',
  'Kareem Abdul-Jabbar',
  // All-Time Top 10-15 Locks
  'Magic Johnson',
  'Larry Bird',
  'Wilt Chamberlain',
  'Bill Russell',
  'Kobe Bryant',
  'Tim Duncan',
  "Shaquille O'Neal",
  'Stephen Curry',
  'Kevin Durant',
  'Hakeem Olajuwon',
  // Perennial All-Stars & MVP Caliber
  'Oscar Robertson',
  'Jerry West',
  'Kevin Garnett',
  'Dirk Nowitzki',
  'Charles Barkley',
  'Karl Malone',
  'Giannis Antetokounmpo',
  'Kawhi Leonard',
  'Allen Iverson',
  'Dwyane Wade',
  'Scottie Pippen',
  'Isiah Thomas',
  'John Stockton',
  'Patrick Ewing',
  'David Robinson',
  'Julius Erving',
  'Moses Malone',
  // Modern Superstars
  'Chris Paul',
  'James Harden',
  'Russell Westbrook',
  'Steve Nash',
  'Jason Kidd',
  // Hall of Fame Legends
  'Gary Payton',
  'Dominique Wilkins',
  'Clyde Drexler',
  'Tracy McGrady',
  'Paul Pierce',
  'Ray Allen',
  'Reggie Miller',
  'Vince Carter',
  'Carmelo Anthony',
  'Dwight Howard',
  'Derrick Rose',
  'Pau Gasol',
  'Tony Parker',
  'Manu Ginobili',
  'Klay Thompson',
  'Draymond Green',
  'Damian Lillard',
  'Anthony Davis',
  'Victor Wembanyama',
  // Foundational & Classic Era Legends
  'George Mikan',
  'Bob Pettit',
  'Elgin Baylor',
  'John Havlicek',
  'Rick Barry',
  'George Gervin',
  'Elvin Hayes',
  'Wes Unseld',
  'Willis Reed',
  'Dave Cowens',
  'Bill Walton',
  'Nate Archibald',
  'Earl Monroe',
  'Pete Maravich',
  'Dolph Schayes',
  'Sam Jones',
  'Kevin McHale',
  'Robert Parish',
  'James Worthy',
  'Jerry Lucas',
  'Bob McAdoo',
  'Nate Thurmond',
  'Dennis Rodman',
];
const nbaGreatsOptions = nbaGreats.map((player) => ({
  value: player,
  label: player,
}));

const nbaTeamsOptions = nbaTeams.map((team) => ({
  value: team,
  label: team,
}));

interface StepThreeProps {
  form: UseFormReturn<OnboardingFormValues>;
  onBack: () => void;
  isLoading: boolean;
  isUsernameAvailable: 'true' | 'false' | 'loading' | 'null';
}

export function StepThree({
  form,
  onBack,
  isLoading,
  isUsernameAvailable,
}: StepThreeProps) {
  return (
    <Card className="gap-2 p-6">
      <h2 className="mb-4 text-2xl font-bold">Who You Got? </h2>

      <div className="space-y-5">
        <FormField
          control={form.control}
          name="favorite_team"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Favorite NBA Team</FormLabel>
              <Combobox
                options={nbaTeamsOptions}
                onChange={field.onChange}
                value={field.value ?? ''}
                placeholder="Favorite NBA Team?"
                searchPlaceholder="Monstars"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="goat"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Who's your GOAT?</FormLabel>
              <Combobox
                options={nbaGreatsOptions}
                onChange={field.onChange}
                value={field.value ?? ''}
                placeholder="Select a player"
                searchPlaceholder="Search for a player..."
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between gap-2">
          <div className="w-1/2">
            <Button
              type="button"
              className="w-full p-6 text-base"
              variant="outline"
              onClick={onBack}
            >
              Back
            </Button>
          </div>
          <div className="w-1/2">
            <MorphButton
              text="Complete Profile"
              variant="default"
              type="submit"
              isLoading={isLoading}
              isAvailable={isUsernameAvailable}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
