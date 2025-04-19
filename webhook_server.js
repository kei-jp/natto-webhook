const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const TODOIST_TOKEN = process.env.TODOIST_TOKEN;

app.use(bodyParser.json());

const registTask = async (project_id, section_id, task_name, tag_ids) => {

	try {

		const taskBody = {};

		taskBody.content = task_name;
		taskBody.label_ids = tag_ids;

		if (section_id) {
			taskBody.section_id = section_id;
		} else if (project_id) {
			taskBody.project_id = project_id;
		}

		// タスク登録
		const response = await axios.post(
			'https://api.todoist.com/rest/v2/tasks',
			taskBody,
			{
				headers: {
					Authorization: `Bearer ${TODOIST_TOKEN}`,
					'Content-Type': 'application/json',
				},
			}
		);

		console.log('✅ タスク登録成功:', response.data);
	} catch (error) {
		console.error('❌ タスク登録失敗:', error.response?.data || error.message);
		throw error;
	}

}

const getObjectID = async (objectType, objectName) => {

	try {

		// 指定IDの取得（任意・なしでもOK）
		const objects = await axios.get(`https://api.todoist.com/rest/v2/${objectType}`, {
			headers: {
				Authorization: `Bearer ${TODOIST_TOKEN}`,
			},
		});

		const object = objects.data.find(o => o.name === objectName);
		return object ? object.id : undefined;

	} catch (error) {
		return undefined;
	}
}

app.post('/todoist', async (req, res) => {
	const { task_name, project_name, section_name, tags, source } = req.body;
	console.log('📦 受け取ったタスク:', { task_name, section_name, tags });

	// タグIDの取得（タグ名からID取得は省略、未指定でOK）
	const tag_ids = []; // tags を使いたい場合は、別APIで取得してID化が必要

	try {

		project_id = await getObjectID('projects', project_name);
		section_id = await getObjectID('sections', section_name);

		if (source === 'siri') {
			const tasks = task_name.split(/\t| /);
			for (const name of tasks) {
				if (name.trim()) {
					await registTask(project_id, section_id, name.trim(), tags);
				}
			}
		// ⚫ その他（ブラウザや他アプリ等）
		} else {
			await registTask(project_id, section_id, task_name.trim(), tags);
		}

		res.status(200).send({ message: '🎉タスク登録完了！' });

	} catch (error) {
		res.status(500).send({ message: `☠️タスク登録に失敗しました:${error.message}` });
	}
});

app.get('/', (req, res) => {
	res.set('Content-Type', 'text/plain; charset=utf-8');
	res.send('しばかれた納豆が叫ぶ未来の入口だよ');
});

app.listen(PORT, () => {
	console.log(`🚀 サーバー起動中: http://localhost:${PORT}`);
});
