import { Command, parseParamsToArray } from 'comtroller';
import { updateUserPoints } from 'yeonna-core';

import { API } from '../../api';

import { ChatContext } from '../../utilities/ChatContext';
import { Log } from '../../utilities/logger';

export const addpoints: Command =
{
  name: 'addpoints',
  run: async ({ context, params }: { context: ChatContext, params: string }) =>
  {
    const twitchChannelID = context.tags['room-id'];
    if(! twitchChannelID)
      return;

    const [ mentioned, amountString ] = parseParamsToArray(params);
    if(! mentioned && ! amountString)
      return;

    let amount = parseInt(amountString);
    if(isNaN(amount))
      return context.send('please enter the amount');

    const user = await API.getUserByName(mentioned.replace(/@/g, ''));
    if(! user)
      return;

    try
    {
      await updateUserPoints({
        twitchID: user.id,
        twitchChannelID,
        amount,
        add: true,
      });

      context.send(`Added ${amount} points to @${user.displayName}`, true);
    }
    catch(error)
    {
      Log.error(error);
      context.send('Cannot add points');
    }
  },
};
