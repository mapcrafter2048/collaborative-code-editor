FROM openjdk:11

WORKDIR /app

# Install dependencies for Kotlin compiler (curl, zip, and unzip)
# Use bash explicitly for SDKMAN installation steps
RUN apt-get update && \
    apt-get install -y curl zip unzip bash && \
    # Use bash -c for the SDKMAN install and kotlin install commands
    bash -c "curl -s https://get.sdkman.io | bash" && \
    bash -c "source $HOME/.sdkman/bin/sdkman-init.sh && sdk install kotlin" && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# <<< ADD THIS LINE >>>
# Add the SDKMAN Kotlin bin directory to the PATH environment variable for subsequent commands
# Note: Assumes SDKMAN installs under /root/ for the root user. Adjust if using a non-root user.
ENV PATH="/root/.sdkman/candidates/kotlin/current/bin:${PATH}"

# The container expects a file named code.kt and an input file.
# Now 'kotlinc' should be found in the PATH automatically.
CMD bash -c "kotlinc code.kt -include-runtime -d code.jar && java -jar code.jar < input.txt"