import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

export const serviceAccount = {
  type: "service_account",
  project_id: "gen-lang-client-0046121044",
  private_key_id: "8f72915794cac48bf4225ae655f15e1695625479",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCvxWri6V+tXEpn\nMzJKS/ZF00md5O9Qb/gsYNzoZfHxnNhckRfrpYEAkt370H1X5s0wJ7/AH5myLrn9\ncpaHd1Y7E2cxFHESKqiwsJqAgtpsXsnVgwoWJeglfdg2OTSqz64NTV2roZDE9mEs\nnPKy7yvbfNtCPzF2cZ4+O4Tvfv0LvizrZu6W7FYyG7B+JFiuJkoJlJfazl3I3b2K\n7iM6+92u5pWFv4yEIhmkmVlPt1duD46gsFmTufnxwbKKv2qVDugBgckl1nQygNUI\nUIGxLrcUh7N7ZIA90AYv3wLTqZf2EY/1Cf9c9IhAJsPwYfW1+KsJMp3BLGfdsWrp\n+6kJOtJXAgMBAAECggEAHRym998sRBPJlO8jUK/lIap9gmPFCT8KTRtb6zfbSyet\npCM54YMfax9oGcltwS3OZT/oH+N7+smHb4VXjidDRnSPvk7C7X3YQ690X32MvK80\nYaMa/BEaMn913IE8CmBsVPKv5XnUdvLRpGh4QA+h5W/4BrBdul7WFTuZaGtRcOyv\nH8MiT8g1kwLqQHW0mx0bJS6HyAMVCuu3rnMHWiCCIm/maimuxrv3zmpi0AREiZk+\nAT0YOl/hi71nlBSHRWlUVBJr2DoSjloAbFFmO94ne9+Yz9f0T5jPCrU1TX+832Qb\nnSr3Zp10o2sY+hBYEF1oV2HM3JWhl8qdDiOE+6FFmQKBgQD0NXwy48Qr2spP94sg\nwBYAU0H2WeeJWPove5m5vJn6V6dbz8OwUKHa4wM7Z+nXbVqfKIuFaxJvN4Tj3opq\nUyQO6IuAZ1APEZd7EV4vZdLAeuyjVBQOX0372T+qNtp1UT1BaGoVnstwgw10iCtE\ng/rMTvSWAL+q9qqke8dCxT7i3wKBgQC4QgQDpZtkS5WyGKvZTPaiK+x2fu+B+R8+\nz7eFBm8W3OOIGtpuKC+z1VWDUmpZRJ/EBto7LW2DfvVlrIvm/Of9Fw6+UnxIRkSw\nPd6yoauHnB2Wk26VF3lVmMKCutrlM+T+LZCOzF+pZpKn56JXak0A6yFJXfJydY4/\nypWKvFq3iQKBgCe1Cpy7rAn1aS/XcCfDE9C5uN/1flA2x3cxAa3RnLe3yN6EyazB\nb4/HmZ7vJnaAsVtvnD/1SOoMfO8QIDFpk1NZPFWEdt/8XEUGbeoHBF2HnzJvWVN8\n65EnodJrWNn6e5tG/vjE+Q8yP93SxjY9v2m47Mv3EzMZKGXWOnAA4ljBAoGAEUM+\nFQli8ZaTQ8hD8Wvgf3kWAlQKJGcuojfbvb7IkZ/IQWwiosdpELQf+tmx1QM05Kyv\nrXOoGvW+D/SGdvGi2ndajkI0GqFathhV0O6Mn3vk2cKeTaGRYI+bSZwv/eFKxvWF\n4ZsMK1bMzqZI81+mLzvYNoNyv358AUX9lK3o4eECgYAxA7PWL2mQsfOGVW6Kl2nz\nm4ucQ99rB8BlE0rCPywkiPLIjKVP6EysuvmVaxBw9Q9+7CT6EYzp6n26N7fj3nOv\nY0p/o4Qij6VQLUVD4VNl3wh3E/0rwxh/+WRHgD8itkuz+5Xr+ZZ7qvDoIEiQvvXw\n0KIyUEHJdV+Nm86VEusU6Q==\n-----END PRIVATE KEY-----\n",
  client_email:
    "gen-lang-client-0046121044@gen-lang-client-0046121044.iam.gserviceaccount.com",
  client_id: "102451489802507770090",
  universe_domain: "googleapis.com",
};

export const filePath = "public/rice.docx";

export const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a user's food companion and catering assitant. Always introduce yourself when greeted with  no more than 3 words
     Highfeast is a Nigerian catering company with over 23 years experience, 
     hence how it has rich datasets and information about menus. {input_documents} 
     contain recipe items and prices in naira of the items for making jollof rice for 500 guest sample size. 
     Use this and the measuring units in {units} as a knowledge base to analyse and give the most relevant answer to users prompts.
     You should always resolve the quantities into common language units users understand, example is 1 gallon

     Follow these other rules when generating an answer:
    - Always respond to greetings and start a conversation introducing yourself in 3 or 4 words.
    - Always assume that highfeast has mastered the menu sizes.
    - Interpret the sizes you come up with in small, standard or large descriptions based on the units given.
    - If you are unable to find an answer about food related request from the knowledge base, respond with I don't have enough information from highfeast on this yet.
    - if your response is request for menus or menu items, give the response in form of an accurate markdown table
    - Do not use ignore greetings from the user.
    - Responses of food list should always be in a table. A good a format for the headers would include condiments,
     one chosen size and estimated prices
     - ignore conversation log not relevant to user's prompt. Always priotize prompts and information from given knowledge base

    INPUT DOCUMENTS: {input_documents}

    MEASURING UNITS: {units}
  
    USER PROMPT: {userPrompt}
  
    CONVERSATION LOG: {messages}
  
    Final answer:`,
  ],
  new MessagesPlaceholder("messages"),
]);

export type PineConeMetadata = Record<string, any>;
