const xml2js = require('xml2js');

function jsToXliff12(obj, opt, cb) {

  if (typeof opt === 'function') {
    cb = opt;
    opt = { pretty: true, indent: ' ', newline: '\n' };
  }

  const builder = new xml2js.Builder({
    rootName: 'xliff',
    headless: true,
    pretty: opt.pretty,
    indent: opt.indent || ' ',
    newline: opt.newline || '\n'
  });

  const xmlJs = {
    $: {
      xmlns: 'urn:oasis:names:tc:xliff:document:1.2',
      version: '1.2',
      srcLang: obj.sourceLanguage,
      trgLang: obj.targetLanguage
    },
    file: []
  };

  Object.keys(obj.resources).forEach((nsName) => {
    const f = {
      $: {
        id: nsName
      },
      'body': {
        'trans-unit': []
      }
    };
    xmlJs.file.push(f);

    Object.keys(obj.resources[nsName]).forEach((k) => {
      const u = {
        $: {
          id: k
        },
        segment: {
          source: obj.resources[nsName][k].source,
          target: obj.resources[nsName][k].target
        }
      };
      f.body['trans-unit'].push(u);
    });
  });

  const xml = builder.buildObject(xmlJs);
  if (cb) cb(null, xml);
  return xml;
}

module.exports = jsToXliff12;