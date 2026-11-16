import {readFile, mkdir, writeFile, copyFile, access} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {parseEnv} from 'node:util';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {createHash} from 'node:crypto';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'output/android-evaluacion');
await mkdir(output, {recursive:true});
try {
  const config = parseEnv(await readFile(path.join(root, '.env.qa'), 'utf8'));
  if (config.QA_STAGE_REF !== 'yecgzorcxkokanuxgwki' ||
      config.SUPABASE_URL !== 'https://yecgzorcxkokanuxgwki.supabase.co' ||
      !/^sb_publishable_[A-Za-z0-9_-]+$/.test(config.SUPABASE_PUBLISHABLE_KEY ?? ''))
    throw new Error('Configuracion QA invalida. No se inicio la compilacion.');
  const javaHome = process.env.GLOVTA_JAVA_HOME || 'C:/Program Files/Android/Android Studio1/jbr';
  await access(path.join(javaHome, 'bin/java.exe'));
  const env = {...process.env, JAVA_HOME:javaHome, GLOVTA_ANDROID_QA:'true',
    SUPABASE_URL:config.SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY:config.SUPABASE_PUBLISHABLE_KEY};
  // Authenticated test passwords and admin credentials are not build inputs.
  for (const key of Object.keys(env)) {
    if (/PASSWORD|SECRET|SERVICE_ROLE|TOKEN/i.test(key)) delete env[key];
  }
  const startedAt = new Date().toISOString();
  let log = '';
  const code = await new Promise((resolve,reject) => {
    const child = spawn('cmd.exe', ['/d','/s','/c','gradlew.bat --no-daemon --console=plain :app:assembleDebug :app:lintDebug'],
      {cwd:path.join(root,'android'), env, windowsHide:true});
    const capture = data => {
      const text = data.toString().replaceAll(config.SUPABASE_PUBLISHABLE_KEY,'[PUBLIC_KEY_REDACTED]');
      log += text; process.stdout.write(text);
    };
    child.stdout.on('data',capture); child.stderr.on('data',capture);
    child.on('error',reject); child.on('close',resolve);
  });
  await writeFile(path.join(output,'build.log'), log);
  if (code !== 0) throw new Error('Compilacion o lint FAIL. Revisar output/android-evaluacion/build.log.');
  const apk = path.join(output,'Glovta-evaluacion-0.1.0-qa.apk');
  await copyFile(path.join(root,'android/app/build/outputs/apk/debug/app-debug.apk'),apk);
  const sha256 = createHash('sha256').update(await readFile(apk)).digest('hex');
  await writeFile(path.join(output,'build-report.json'),JSON.stringify({startedAt,finishedAt:new Date().toISOString(),
    status:'PASS',tasks:['assembleDebug','lintDebug'],ref:config.QA_STAGE_REF,applicationId:'com.glovta.app.evaluacion',
    version:'0.1.0-qa',versionCode:1,apk,sha256,physicalDevice:'NOT RUN',authenticatedAndroid:'NOT RUN'},null,2));
  console.log('APK QA generada: '+apk);
} catch (error) { console.error(error.message); process.exitCode=1; }
