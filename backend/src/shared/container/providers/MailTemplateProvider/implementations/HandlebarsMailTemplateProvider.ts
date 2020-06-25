import handlebars from 'handlebars';

import IMailTemplateProvider from '../models/IMailTemplateProvider';
import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';

class HandlebarsMailTemplateProvider implements IMailTemplateProvider {
  public async parse({
    template,
    variables
  }: IParseMailTemplateDTO): Promise<string> {
    const parseTemplates = handlebars.compile(template);

    return parseTemplates(variables);
  }
}

export default HandlebarsMailTemplateProvider;
