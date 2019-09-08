// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { TimexProperty } = require('@microsoft/recognizers-text-data-types-timex-expression');
const { InputHints, MessageFactory } = require('botbuilder');
const { ConfirmPrompt, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');
const { CancelAndHelpDialog } = require('./cancelAndHelpDialog');

const CONFIRM_PROMPT = 'confirmPrompt';
const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';

class BoxCSDialog extends CancelAndHelpDialog {
    constructor(id) {
        super(id || 'boxCSDialog');

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.firstStep.bind(this),
                this.originStep.bind(this),
                this.finalStep.bind(this)
            ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

      
    async firstStep(stepContext) {
        const qryDetails = stepContext.options;

        if (!qryDetails.firstStep) {
            const messageText = 'what is your query?';
            const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
            return await stepContext.prompt(TEXT_PROMPT, { prompt: msg });
        }
        return await stepContext.next(qryDetails.first);
    }

    async originStep(stepContext) {
        const qryDetails = stepContext.options;

        // Capture the response to the previous step's prompt
        qryDetails.first = stepContext.result;
        if (!qryDetails.first) {
            const messageText = 'what is your query123?';
            const msg = MessageFactory.text(messageText, 'What is your Query123?', InputHints.ExpectingInput);
            return await stepContext.prompt(TEXT_PROMPT, { prompt: msg });
        }
        return await stepContext.next(qryDetails.first);
    }

       /**
     * Complete the interaction and end the dialog.
     */
    async finalStep(stepContext) {
        if (stepContext.result === true) {
            const qryDetails = stepContext.options;
            return await stepContext.endDialog(qryDetails);
        }
        return await stepContext.endDialog();
    }

}

module.exports.BoxCSDialog = BoxCSDialog;
