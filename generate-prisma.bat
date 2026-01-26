@echo off
cd /d D:\projetos\pessoal\blogtech\blogtech-be
echo Executando Prisma Generate...
call pnpm prisma generate
echo.
echo Prisma Client gerado com sucesso!
pause

