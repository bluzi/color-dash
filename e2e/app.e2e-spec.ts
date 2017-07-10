import { KatyushaPage } from './app.po';

describe('katyusha App', () => {
  let page: KatyushaPage;

  beforeEach(() => {
    page = new KatyushaPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
