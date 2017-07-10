import { ColorDashPage } from './app.po';

describe('color-dash App', () => {
  let page: ColorDashPage;

  beforeEach(() => {
    page = new ColorDashPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
