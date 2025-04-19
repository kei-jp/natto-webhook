const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const TODOIST_TOKEN = process.env.TODOIST_TOKEN;

app.use(bodyParser.json());

app.post('/todoist', async (req, res) => {
	const { task_name, section_name, tags } = req.body;
	console.log('📦 受け取ったタスク:', { task_name, section_name, tags });

	try {
		// タグIDの取得（タグ名からID取得は省略、未指定でOK）
		const tag_ids = []; // tags を使いたい場合は、別APIで取得してID化が必要

		// セクションIDの取得（任意・なしでもOK）
		const sections = await axios.get('https://api.todoist.com/rest/v2/sections', {
			headers: {
				Authorization: `Bearer ${TODOIST_TOKEN}`,
			},
		});

		const section = sections.data.find(s => s.name === section_name);
		const section_id = section ? section.id : undefined;

		// タスク登録
		const response = await axios.post(
			'https://api.todoist.com/rest/v2/tasks',
			{
				content: task_name,
				section_id,
				label_ids: tag_ids,
			},
			{
				headers: {
					Authorization: `Bearer ${TODOIST_TOKEN}`,
					'Content-Type': 'application/json',
				},
			}
		);

		console.log('✅ タスク登録成功:', response.data);
		res.status(200).send({ message: 'タスク登録完了！' });
	} catch (error) {
		console.error('❌ タスク登録失敗:', error.response?.data || error.message);
		res.status(500).send({ error: 'タスク登録に失敗しました' });
	}
});

app.get('/', (req, res) => {
	res.set('Content-Type', 'text/plain; charset=utf-8');
	res.send('しばかれて納豆が叫く未来の入口だよ');
});

app.listen(PORT, () => {
	console.log(`🚀 サーバー起動中: http://localhost:${PORT}`);
});
