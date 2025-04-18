// webhook_server.js
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todoist', (req, res) => {
  const { task_name, section_name, tags } = req.body;

  console.log('�󂯎�����^�X�N:', { task_name, section_name, tags });

  // TODO: Todoist API �Ń^�X�N�o�^����������

  res.status(200).send({ message: 'Webhook��M�����I' });
});

app.get('/', (req, res) => {
  res.send('�[�������΂ꂵ�����̓�������');
});

app.listen(PORT, () => {
  console.log(`�T�[�o�[�N����: http://localhost:${PORT}`);
});
