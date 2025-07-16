# runner/lua-runner.dockerfile
# Use an official Lua image (luarocks includes Lua)
FROM luarocks/lua:latest
# Or specifically: FROM luajit/luajit:latest for LuaJIT, or install lua on a base image

WORKDIR /app

# Run the Lua script using the lua interpreter, piping input from input.txt.
CMD lua code.lua < input.txt