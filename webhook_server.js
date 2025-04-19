// webhook_server.js
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todoist', (req, res) => {
  const { task_name, section_name, tags } = req.body;

  console.log('受け取ったタスク:', { task_name, section_name, tags });

  // TODO: Todoist API でタスク登録処理を書く

  res.status(200).send({ message: 'Webhook受信成功！' });
});

app.get('/', (req, res) => {
  res.set('Content-Type', 'text/plain; charset=utf-8');
  res.send('しばかれて納豆が叫く未来の入口だよ');
});

app.listen(PORT, () => {
  console.log(`サーバー起動中: http://localhost:${PORT}`);
});
