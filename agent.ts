import {FunctionTool, LlmAgent} from '@google/adk';
import {z} from 'zod';

/* Mock tool implementation */
const getCurrentTime = new FunctionTool({
  name: 'get_current_time',
  description: 'Returns the current time in a specified city.',
  parameters: z.object({
    city: z.string().describe("The name of the city for which to retrieve the current time."),
  }),
  execute: ({city}) => {
    return {status: 'success', report: `The current time in ${city} is Intl.DateTimeFormat().format(new Date())}`};
  },
});

const getWeather = new FunctionTool({
    name: 'get_weather',
    description: 'Retrieves the current weather report for a specified city.',
    parameters: z.object({
      city: z.string().describe('The name of the city for which to retrieve the weather report.'),
    }),
    execute: ({ city }) => {
      if (city.toLowerCase() === 'new york') {
        return {
          status: 'success',
          report:
            'The weather in New York is sunny with a temperature of 25 degrees Celsius (77 degrees Fahrenheit).',
        };
      } else {
        return {
          status: 'error',
          error_message: `Weather information for '${city}' is not available.`,
        };
      }
    },
  });

export const rootAgent = new LlmAgent({
  name: 'hello_time_weather_agent',
  model: 'gemini-flash-latest',
  description: 'Tells the current time and weather in a specified city.',
  instruction: `You are a helpful assistant that tells the current time and weather in a city.
                Use the 'getCurrentTime' and 'getWeather' tools for this purpose.`,
  tools: [getCurrentTime,getWeather],
});