import chai           from 'chai';
import chaiImmutable  from 'chai-immutable';
import equalJSX       from 'chai-equal-jsx';
import sinonChai      from 'sinon-chai';

chai.use(chaiImmutable);
chai.use(equalJSX);
chai.use(sinonChai);

console.info('---- Tests Starting -----');
